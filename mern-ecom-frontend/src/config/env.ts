const required = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) throw new Error(`Missing required env variable: ${key}`);
    return value;
};

export const env = {
    serverUrl: required("VITE_SERVER"),
    stripeKey: required("VITE_STRIPE_KEY"),
    firebase: {
        apiKey: required("VITE_FIREBASE_KEY"),
        authDomain: required("VITE_AUTH_DOMAIN"),
        projectId: required("VITE_PROJECT_ID"),
        storageBucket: required("VITE_STORAGE_BUCKET"),
        messagingSenderId: required("VITE_MESSAGING_SENDER_ID"),
        appId: required("VITE_APP_ID"),
        measurementId: import.meta.env.VITE_MEASUREMENT_ID ?? "",
    },
} as const;
