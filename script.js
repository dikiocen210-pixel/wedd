// ===================================
// Wedding Invitation - JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loading');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);

    // Music Control
    initMusicControl();

    // Countdown Timer
    initCountdown();

    // Scroll Animations
    initScrollAnimations();

    // Guest Book
    initGuestBook();

    // Smooth Scroll for Navigation
    initSmoothScroll();
});

// ===================================
// Music Control (BGM - BackGround Music)
// ===================================
function initMusicControl() {
    const musicBtn = document.getElementById('musicBtn');
    const weddingMusic = document.getElementById('weddingMusic');
    
    // Set volume
    weddingMusic.volume = 0.5;
    
    // Auto play music when loading screen is hidden
    const loadingScreen = document.getElementById('loading');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('hidden')) {
                // Auto play music after loading screen is hidden
                setTimeout(() => {
                    weddingMusic.muted = false; // Unmute first
                    weddingMusic.play()
                        .then(() => {
                            musicBtn.classList.add('playing');
                            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        })
                        .catch(error => {
                            console.log('Auto play blocked:', error);
                        });
                }, 500);
                observer.disconnect();
            }
        });
    });
    
    observer.observe(loadingScreen, { attributes: true, attributeFilter: ['class'] });
    
    // Toggle music on button click
    musicBtn.addEventListener('click', function() {
        toggleMusic(weddingMusic, musicBtn);
    });

    // Update button icon when music ends
    weddingMusic.addEventListener('ended', function() {
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    });
}

function toggleMusic(weddingMusic, musicBtn) {
    if (weddingMusic.paused) {
        weddingMusic.play()
            .then(() => {
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(error => {
                console.log('Cannot play music:', error);
            });
    } else {
        weddingMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    }
}

// ===================================
// Countdown Timer
// ===================================
function initCountdown() {
const weddingDate = new Date('August 29, 2026 11:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p class="happening">Acara Sedang Berlangsung!</p>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const slideElements = document.querySelectorAll('.slide-element');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index within parent
                const parentChildren = entry.target.parentElement.querySelectorAll('.slide-element');
                const childIndex = Array.from(parentChildren).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.classList.add('slide-in');
                }, childIndex * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    slideElements.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// ===================================
// Guest Book System
// ===================================
function initGuestBook() {
    const guestForm = document.getElementById('guestForm');
    
    // Load existing comments
    loadComments();

    // Form submission
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('guestName').value;
        const attendance = document.getElementById('attendance').value;
        const comment = document.getElementById('comment').value;

        // Create comment object
        const commentData = {
            id: Date.now(),
            name: name,
            attendance: attendance,
            comment: comment,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        saveComment(commentData);

        // Add to display
        addCommentToDisplay(commentData);

        // Reset form
        guestForm.reset();

        // Show success message
        showNotification('Ucapan Anda telah terkirim!', 'success');
    });
}

function saveComment(commentData) {
    let comments = JSON.parse(localStorage.getItem('weddingComments')) || [];
    comments.unshift(commentData); // Add to beginning
    localStorage.setItem('weddingComments', JSON.stringify(comments));
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('weddingComments')) || [];
    const container = document.getElementById('commentsContainer');
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="no-comments">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
    }

    container.innerHTML = '';
    comments.forEach(comment => {
        addCommentToDisplay(comment);
    });
}

function addCommentToDisplay(commentData) {
    const container = document.getElementById('commentsContainer');
    
    // Remove "no comments" message if exists
    const noComments = container.querySelector('.no-comments');
    if (noComments) {
        noComments.remove();
    }

    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
        <div class="comment-header">
            <span class="comment-name">${escapeHtml(commentData.name)}</span>
            <span class="comment-attendance ${commentData.attendance}">
                ${commentData.attendance === 'hadir' ? '✓ Hadir' : '✗ Tidak Hadir'}
            </span>
        </div>
        <p class="comment-text">${escapeHtml(commentData.comment)}</p>
        <span class="comment-time">${formatTimestamp(commentData.timestamp)}</span>
    `;

    // Insert at the beginning
    container.insertBefore(commentCard, container.firstChild);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

