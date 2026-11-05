import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { UserProfile, Workspace } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  workspace: Workspace | null;
  loading: boolean;
  isDemoMode: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (fullName: string, email: string, pass: string, companyName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  exitDemoMode: () => void;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  updateProfileDetails: (data: Partial<UserProfile>) => Promise<void>;
  updateWorkspaceDetails: (data: Partial<Workspace>) => Promise<void>;
  completeOnboarding: (data: { companyName: string; industry: string; companySize: string; role: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_PROFILE: UserProfile = {
  uid: 'demo-enterprise-lead',
  fullName: 'Alex Vance',
  email: 'alex.vance@opsmind.ai',
  role: 'VP of Business Operations',
  companyName: 'Acme Global Operations',
  createdAt: '2026-11-01T00:00:00Z',
  onboardingCompleted: true,
  activeWorkspaceId: 'default-workspace',
};

const DEMO_WORKSPACE: Workspace = {
  workspaceId: 'default-workspace',
  name: 'Acme Global Operations',
  industry: 'Enterprise Software & Logistics',
  companySize: '250-1000 employees',
  ownerId: 'demo-enterprise-lead',
  createdAt: '2026-11-01T00:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('opsmind_demo_mode') === 'true';
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    if (isDemoMode) {
      setUserProfile(DEMO_USER_PROFILE);
      setWorkspace(DEMO_WORKSPACE);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);

            if (data.activeWorkspaceId) {
              const wsSnap = await getDoc(doc(db, 'workspaces', data.activeWorkspaceId));
              if (wsSnap.exists()) {
                setWorkspace(wsSnap.data() as Workspace);
              }
            }
          } else {
            // Initial fallback profile
            const newProfile: UserProfile = {
              uid: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'Operations Lead',
              email: user.email || '',
              photoURL: user.photoURL || undefined,
              role: 'Workspace Administrator',
              createdAt: new Date().toISOString(),
              onboardingCompleted: false,
              activeWorkspaceId: `ws-${user.uid.slice(0, 8)}`,
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err);
        }
      } else {
        setUserProfile(null);
        setWorkspace(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsDemoMode(false);
    localStorage.removeItem('opsmind_demo_mode');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (fullName: string, email: string, pass: string, companyName: string) => {
    setIsDemoMode(false);
    localStorage.removeItem('opsmind_demo_mode');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const workspaceId = `ws-${cred.user.uid.slice(0, 8)}`;

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName,
      email,
      role: 'Operations Administrator',
      companyName,
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      activeWorkspaceId: workspaceId,
    };

    const newWorkspace: Workspace = {
      workspaceId,
      name: companyName || `${fullName}'s Workspace`,
      industry: 'Business Operations',
      ownerId: cred.user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      await setDoc(doc(db, 'workspaces', workspaceId), newWorkspace);
      await sendEmailVerification(cred.user);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }

    setUserProfile(newProfile);
    setWorkspace(newWorkspace);
  };

  const loginWithGoogle = async () => {
    setIsDemoMode(false);
    localStorage.removeItem('opsmind_demo_mode');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      const workspaceId = `ws-${user.uid.slice(0, 8)}`;
      const newProfile: UserProfile = {
        uid: user.uid,
        fullName: user.displayName || 'Operations Lead',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
        role: 'Operations Administrator',
        createdAt: new Date().toISOString(),
        onboardingCompleted: true,
        activeWorkspaceId: workspaceId,
      };
      const newWorkspace: Workspace = {
        workspaceId,
        name: `${user.displayName || 'Executive'}'s Workspace`,
        industry: 'Technology & Operations',
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newProfile);
      await setDoc(doc(db, 'workspaces', workspaceId), newWorkspace);
      setUserProfile(newProfile);
      setWorkspace(newWorkspace);
    }
  };

  const loginAsDemo = () => {
    setIsDemoMode(true);
    localStorage.setItem('opsmind_demo_mode', 'true');
    setUserProfile(DEMO_USER_PROFILE);
    setWorkspace(DEMO_WORKSPACE);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('opsmind_demo_mode');
    setUserProfile(null);
    setWorkspace(null);
  };

  const logout = async () => {
    if (isDemoMode) {
      exitDemoMode();
      return;
    }
    await signOut(auth);
    setUserProfile(null);
    setWorkspace(null);
  };

  const sendResetEmail = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileDetails = async (data: Partial<UserProfile>) => {
    if (isDemoMode) {
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
      return;
    }
    if (!currentUser) throw new Error('No authenticated user');
    const ref = doc(db, 'users', currentUser.uid);
    await updateDoc(ref, data);
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const updateWorkspaceDetails = async (data: Partial<Workspace>) => {
    if (isDemoMode) {
      setWorkspace((prev) => (prev ? { ...prev, ...data } : null));
      return;
    }
    if (!workspace) throw new Error('No active workspace');
    const ref = doc(db, 'workspaces', workspace.workspaceId);
    await updateDoc(ref, data);
    setWorkspace((prev) => (prev ? { ...prev, ...data } : null));
  };

  const completeOnboarding = async (data: { companyName: string; industry: string; companySize: string; role: string }) => {
    if (isDemoMode) {
      setUserProfile((prev) => (prev ? { ...prev, onboardingCompleted: true, role: data.role, companyName: data.companyName } : null));
      setWorkspace((prev) => (prev ? { ...prev, name: data.companyName, industry: data.industry, companySize: data.companySize } : null));
      return;
    }
    if (!currentUser || !userProfile) throw new Error('Not authenticated');

    const updatedProfile = {
      role: data.role,
      companyName: data.companyName,
      onboardingCompleted: true,
    };
    await updateProfileDetails(updatedProfile);

    if (userProfile.activeWorkspaceId) {
      await updateWorkspaceDetails({
        name: data.companyName,
        industry: data.industry,
        companySize: data.companySize,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        workspace,
        loading,
        isDemoMode,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemo,
        exitDemoMode,
        logout,
        sendResetEmail,
        updateProfileDetails,
        updateWorkspaceDetails,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
