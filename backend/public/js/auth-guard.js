// Authentication Guard - Prevents unauthorized access to protected pages
(function() {
    'use strict';

    // List of protected pages that require authentication
    const protectedPages = [
        'checkout.html',
        'checkout-v2.html',
        'homenocourses.html',
        'student-dashboard.html',
        'course-physics.html',
        'course-chemistry.html',
        'course-biology.html',
        'mathcourse.html',
        'english-dashboard.html',
        'english-lectures.html',
        'english-homework.html',
        'english-quiz.html',
        'english-exam.html',
        'english-progress.html',
        'english-practice.html',
        'english-past-papers.html',
        'english-badges.html',
        'student-profile.html',
        'parent-dashboard.html',
        'teacher-dashboard.html',
        'admin-panel.html',
        'admin-content-manager.html'
    ];

    // Pages that are always accessible (public pages)
    const publicPages = [
        'index.html',
        'about.html',
        'contact.html',
        'courses.html',
        'community.html',
        '/'
    ];

    // Check if user is authenticated
    function isAuthenticated() {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        return !!(authToken && userId && userEmail);
    }

    // Check if current page is protected
    function isProtectedPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        return protectedPages.some(page => currentPage.includes(page));
    }

    // Check if user came from a valid referrer (internal navigation)
    function hasValidReferrer() {
        const referrer = document.referrer;
        const currentOrigin = window.location.origin;
        
        // Allow if referrer is from same origin
        if (referrer && referrer.startsWith(currentOrigin)) {
            return true;
        }
        
        // Allow if there's a valid session flag
        const navigationFlag = sessionStorage.getItem('validNavigation');
        if (navigationFlag === 'true') {
            return true;
        }
        
        return false;
    }

    // Set navigation flag when user navigates internally
    function setNavigationFlag() {
        sessionStorage.setItem('validNavigation', 'true');
    }

    // Clear navigation flag
    function clearNavigationFlag() {
        sessionStorage.removeItem('validNavigation');
    }

    // Redirect to login page
    function redirectToLogin() {
        // Clear navigation flag
        clearNavigationFlag();
        
        // Store intended destination
        const intendedPage = window.location.href;
        sessionStorage.setItem('intendedDestination', intendedPage);
        
        // Show alert
        alert('Please log in to access this page.');
        
        // Redirect to home page
        window.location.replace('/index.html');
    }

    // Main guard function
    function checkAccess() {
        // Skip check if on public page
        if (!isProtectedPage()) {
            return;
        }

        // Check authentication
        if (!isAuthenticated()) {
            console.log('🚫 Access denied: User not authenticated');
            redirectToLogin();
            return;
        }

        // Check if user navigated properly (not direct URL typing)
        if (!hasValidReferrer()) {
            console.log('🚫 Access denied: Invalid navigation (direct URL access)');
            alert('Please navigate through the website menu. Direct URL access is not allowed.');
            redirectToLogin();
            return;
        }

        console.log('✅ Access granted: User authenticated and valid navigation');
    }

    // Intercept all link clicks to set navigation flag
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin)) {
            setNavigationFlag();
        }
    }, true);

    // Intercept form submissions to set navigation flag
    document.addEventListener('submit', function(e) {
        setNavigationFlag();
    }, true);

    // Run guard on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAccess);
    } else {
        checkAccess();
    }

    // Also run immediately to catch early access attempts
    checkAccess();

    // Monitor for authentication changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'authToken' || e.key === 'userId') {
            if (!isAuthenticated() && isProtectedPage()) {
                redirectToLogin();
            }
        }
    });

    // Set navigation flag when user logs in successfully
    window.addEventListener('loginSuccess', function() {
        setNavigationFlag();
    });

    // Clear navigation flag on logout
    window.addEventListener('logout', function() {
        clearNavigationFlag();
    });

})();
