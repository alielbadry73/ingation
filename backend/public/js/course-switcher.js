// Course Switcher - Shared functionality for all subject dashboards
// This file handles the course switcher dropdown that allows students to switch between purchased courses

(function() {
    'use strict';

    // Course details configuration
    const courseDetails = {
        'physics': {
            name: 'Physics IGCSE',
            icon: 'material-symbols:science',
            gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
            url: 'physics-dashboard.html'
        },
        'mathematics': {
            name: 'Mathematics IGCSE',
            icon: 'material-symbols:calculate',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            url: 'mathematics-dashboard.html'
        },
        'english': {
            name: 'English IGCSE',
            icon: 'material-symbols:menu-book',
            gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
            url: 'english-dashboard.html'
        },
        'chemistry': {
            name: 'Chemistry IGCSE',
            icon: 'material-symbols:biotech',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            url: 'chemistry-dashboard.html'
        }
    };

    // Course ID mapping (numeric to string)
    const courseMap = {
        '1': 'mathematics',
        '2': 'physics',
        '3': 'english',
        '4': 'chemistry',
        'mathematics': 'mathematics',
        'physics': 'physics',
        'english': 'english',
        'chemistry': 'chemistry'
    };

    // Initialize course switcher
    window.initCourseSwitcher = function(currentCourse) {
        console.log('🔄 Initializing course switcher for:', currentCourse);
        
        const courseSwitcherContainer = document.getElementById('courseSwitcherContainer');
        const dropdownContent = document.querySelector('.dropdown-content');
        
        if (!courseSwitcherContainer || !dropdownContent) {
            console.warn('⚠️ Course switcher elements not found');
            return;
        }

        // Get enrolled courses from localStorage
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        console.log('📚 Enrolled courses from localStorage:', enrolledCourses);
        
        // Convert numeric IDs to string IDs
        const purchasedCourseIds = enrolledCourses
            .map(id => courseMap[id] || id)
            .filter(Boolean);
        
        console.log('✅ Purchased course IDs:', purchasedCourseIds);
        
        // Generate course items HTML for purchased courses only
        if (purchasedCourseIds.length > 0) {
            let coursesHTML = '';
            
            purchasedCourseIds.forEach(courseId => {
                const course = courseDetails[courseId];
                if (!course) return;
                
                const isActive = courseId === currentCourse;
                const activeClass = isActive ? 'active' : '';
                const activeStyle = isActive ? 'background: #f8f9ff;' : '';
                const checkIcon = isActive ? '<iconify-icon icon="material-symbols:check-circle" style="color: #10b981; font-size: 1.2rem;"></iconify-icon>' : '';
                const statusText = isActive ? 'Current Course' : 'Available';
                
                coursesHTML += `
                    <div class="course-item ${activeClass}" onclick="switchCourse('${courseId}')" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; ${activeStyle}">
                        <div class="course-icon" style="width: 32px; height: 32px; background: ${course.gradient}; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <iconify-icon icon="${course.icon}" style="color: white; font-size: 1.1rem;"></iconify-icon>
                        </div>
                        <div class="course-info">
                            <div style="font-weight: 600; color: #333; font-size: 0.9rem;">${course.name}</div>
                            <div style="font-size: 0.8rem; color: #666;">${statusText}</div>
                        </div>
                        ${checkIcon}
                    </div>
                `;
            });
            
            dropdownContent.innerHTML = coursesHTML;
            console.log('✅ Updated course switcher with', purchasedCourseIds.length, 'purchased courses');
        }
        
        // Update button text with current course name
        const buttonText = document.querySelector('.course-switcher-btn span');
        if (buttonText && courseDetails[currentCourse]) {
            buttonText.textContent = courseDetails[currentCourse].name.replace(' IGCSE', '');
        }
        
        // Show/hide course switcher based on number of purchased courses
        if (purchasedCourseIds.length > 1) {
            courseSwitcherContainer.style.display = 'flex';
            console.log('✅ Showing course switcher (multiple courses)');
        } else {
            courseSwitcherContainer.style.display = 'none';
            console.log('ℹ️ Hiding course switcher (only one course)');
        }
    };

    // Toggle course dropdown
    window.toggleCourseDropdown = function() {
        const dropdown = document.getElementById('courseDropdown');
        const arrow = document.getElementById('courseDropdownArrow');
        
        if (!dropdown || !arrow) return;
        
        if (dropdown.style.opacity === '1') {
            // Close dropdown
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
            arrow.style.transform = 'rotate(0deg)';
        } else {
            // Open dropdown
            dropdown.style.opacity = '1';
            dropdown.style.visibility = 'visible';
            dropdown.style.transform = 'translateY(0)';
            arrow.style.transform = 'rotate(180deg)';
        }
    };

    // Switch to a different course
    window.switchCourse = function(course) {
        console.log('🔄 Switching to course:', course);
        
        // Close dropdown
        const dropdown = document.getElementById('courseDropdown');
        const arrow = document.getElementById('courseDropdownArrow');
        
        if (dropdown && arrow) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
            arrow.style.transform = 'rotate(0deg)';
        }
        
        // Navigate to selected course dashboard
        if (courseDetails[course] && courseDetails[course].url) {
            // Show loading state
            const button = document.querySelector('.course-switcher-btn span');
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Switching...';
            }
            
            // Navigate after short delay
            setTimeout(() => {
                window.location.href = courseDetails[course].url;
            }, 300);
        } else {
            console.error('❌ Invalid course:', course);
        }
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const courseSwitcher = document.querySelector('.course-switcher');
        const dropdown = document.getElementById('courseDropdown');
        const arrow = document.getElementById('courseDropdownArrow');
        
        if (courseSwitcher && dropdown && !courseSwitcher.contains(event.target)) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-10px)';
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }
    });

    console.log('✅ Course switcher module loaded');
})();
