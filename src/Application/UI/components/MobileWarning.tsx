import React, { useEffect } from 'react';

const MobileWarning: React.FC = () => {
    useEffect(() => {
        // Check if device is mobile
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Immediate redirect to main site for mobile devices
        if (isMobile) {
            window.location.replace('https://digitinexus.com');
        }
    }, []);

    // Don't render anything - redirect happens immediately
    return null;
};

export default MobileWarning;

