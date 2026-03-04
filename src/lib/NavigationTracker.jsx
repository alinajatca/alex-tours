import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
    const location = useLocation();

    useEffect(() => {
        // Track navigation (optional - can be used for analytics later)
        console.log('Navigated to:', location.pathname);
    }, [location]);

    return null;
}