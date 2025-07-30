<template>
    <div class="sidebar-container">
        <!-- Mobile overlay -->
        <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="toggleMobileMenu"></div>

        <!-- Sidebar -->
        <aside class="sidebar" :class="{ 'sidebar-mobile-open': isMobileMenuOpen, 'sidebar-collapsed': isCollapsed }"
            @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <!-- Logo/Brand -->
            <div class="sidebar-header">
                <div class="logo">
                    <div class="logo-icon">
                        <span v-if="isCollapsed">ദ്ദി</span>
                        <span v-else>ദ്ദി(˵ •̀ ᴗ - ˵ )</span>
                    </div>
                    <span v-if="!isCollapsed" class="logo-text">IM-OKTOO</span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="sidebar-nav">
                <!-- Profile Section -->
                <div class="nav-section">
                    <div class="section-title" v-if="!isCollapsed">PROFILE</div>

                    <!-- Home -->
                    <div class="nav-item" :class="{ active: activeItem === 'home' }">
                        <div class="nav-link" @click="setActiveItem('home')">
                            <i class="icon">🏠</i>
                            <span v-if="!isCollapsed">Home</span>
                        </div>
                    </div>

                    <!-- Profile with Submenu -->
                    <div class="nav-item" :class="{ active: activeItem === 'profile' }">
                        <div class="nav-link" @click="toggleSubmenu('profile')">
                            <i class="icon">👤</i>
                            <span v-if="!isCollapsed">Profile</span>
                            <i v-if="!isCollapsed" class="arrow" :class="{ 'arrow-open': openSubmenus.profile }">▼</i>
                        </div>

                        <!-- Submenu -->
                        <div v-if="!isCollapsed" class="submenu" :class="{ 'submenu-open': openSubmenus.profile }">
                            <div class="submenu-item" @click="setActiveItem('passwords')">
                                <span>Passwords</span>
                            </div>
                            <div class="submenu-item" @click="setActiveItem('mail')">
                                <span>Mail</span>
                            </div>
                            <div class="submenu-item" @click="setActiveItem('accounts')">
                                <span>Accounts</span>
                            </div>
                        </div>
                    </div>

                    <!-- Messages -->
                    <div class="nav-item" :class="{ active: activeItem === 'messages' }">
                        <div class="nav-link" @click="setActiveItem('messages')">
                            <i class="icon">💬</i>
                            <span v-if="!isCollapsed">Messages</span>
                        </div>
                    </div>
                </div>

                <!-- Menu Section -->
                <div class="nav-section">
                    <div class="section-title" v-if="!isCollapsed">MENU</div>

                    <!-- Notifications with Submenu -->
                    <div class="nav-item" :class="{ active: activeItem === 'notifications' }">
                        <div class="nav-link" @click="toggleSubmenu('notifications')">
                            <i class="icon">🔔</i>
                            <span v-if="!isCollapsed">Notifications</span>
                            <i v-if="!isCollapsed" class="arrow"
                                :class="{ 'arrow-open': openSubmenus.notifications }">▼</i>
                        </div>

                        <!-- Submenu -->
                        <div v-if="!isCollapsed" class="submenu"
                            :class="{ 'submenu-open': openSubmenus.notifications }">
                            <div class="submenu-item" @click="setActiveItem('alerts')">
                                <span>Alerts</span>
                            </div>
                            <div class="submenu-item" @click="setActiveItem('updates')">
                                <span>Updates</span>
                            </div>
                        </div>
                    </div>

                    <!-- Calendar -->
                    <div class="nav-item" :class="{ active: activeItem === 'calendar' }">
                        <div class="nav-link" @click="setActiveItem('calendar')">
                            <i class="icon">📅</i>
                            <span v-if="!isCollapsed">Calendar</span>
                        </div>
                    </div>

                    <!-- Explore -->
                    <div class="nav-item" :class="{ active: activeItem === 'forum' }">
                        <div class="nav-link" @click="setActiveItem('forum')">
                            <i class="icon">🔍</i>
                            <span v-if="!isCollapsed">Forum</span>
                        </div>
                    </div>

                    <!-- Resources -->
                    <div class="nav-item" :class="{ active: activeItem === 'resources' }">
                        <div class="nav-link" @click="setActiveItem('resources')">
                            <i class="icon">📑</i>
                            <span v-if="!isCollapsed">Resources</span>
                        </div>
                    </div>

                    <!-- Settings -->
                    <div class="nav-item" :class="{ active: activeItem === 'settings' }">
                        <div class="nav-link" @click="setActiveItem('settings')">
                            <i class="icon">⚙️</i>
                            <span v-if="!isCollapsed">Settings</span>
                        </div>
                    </div>
                </div>


                <!-- Logout Button -->
                <div class="nav-item">
                    <div class="nav-link logout-link" @click="handleLogout" style="color: #dc3545; font-weight: 500;">
                        <i class="icon">🚪</i>
                        <span v-if="!isCollapsed">Logout</span>
                    </div>
                </div>
            </nav>
            <!-- Toggle Button (Hidden) -->
            <div class="sidebar-toggle" @click="toggleSidebar" style="display: none;">
                <i class="icon">{{ isCollapsed ? '→' : '←' }}</i>
            </div>
        </aside>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'SideBar',
    data() {
        return {
            isCollapsed: true, // Start collapsed
            isMobileMenuOpen: false,
            activeItem: 'home',
            openSubmenus: {
                profile: false,
                notifications: false
            },
            hoverTimeout: null
        }
    },
    methods: {
        handleMouseEnter() {
            // Only on desktop
            if (window.innerWidth > 768) {
                // Clear any existing timeout
                if (this.hoverTimeout) {
                    clearTimeout(this.hoverTimeout);
                }
                // Expand sidebar immediately on hover
                this.isCollapsed = false;
                // Emit state change to parent
                this.$emit('sidebar-state-changed', false);
            }
        },
        handleMouseLeave() {
            // Only on desktop
            if (window.innerWidth > 768) {
                // Collapse sidebar after a short delay
                this.hoverTimeout = setTimeout(() => {
                    this.isCollapsed = true;
                    // Emit state change to parent
                    this.$emit('sidebar-state-changed', true);
                    // Close all submenus when collapsing
                    this.openSubmenus = {
                        profile: false,
                        notifications: false
                    };
                }, 300); // 300ms delay before collapsing
            }
        },
        toggleSidebar() {
            // Keep this method for mobile or manual toggle if needed
            this.isCollapsed = !this.isCollapsed;
            if (this.isCollapsed) {
                // Close all submenus when collapsing
                this.openSubmenus = {
                    profile: false,
                    notifications: false
                };
            }
            // Emit state change to parent
            this.$emit('sidebar-state-changed', this.isCollapsed);
        },
        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        toggleSubmenu(menu) {
            if (this.isCollapsed) return;
            this.openSubmenus[menu] = !this.openSubmenus[menu];
        },
        setActiveItem(item) {
            // Handle navigation
            if (item === "home") {
                this.$router.push('/home');
            } else if (item === "resources") {
                this.$router.push('/resources');
            } else if (item === "forum") {
                this.$router.push('/forum');
            } else if (item == "calendar") {
                this.$router.push('/calendar');
            } else if (item == "settings") {
                this.$router.push('/settings');
            }

            this.activeItem = item;
            // Close mobile menu when item is selected
            this.isMobileMenuOpen = false;
            // Emit event to parent component
            this.$emit('menu-item-selected', item);
        },
        handleLogout() {
            // Confirm logout
            if (confirm('Are you sure you want to logout?')) {
                // Clear all authentication data
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('username');
                localStorage.removeItem('googleAuth');
                localStorage.removeItem('authToken');
                this.$router.replace('/');
                console.log("LEAVE")
                // Clear any other auth-related data you might have stored
                sessionStorage.clear();

                // Close mobile menu if open
                this.isMobileMenuOpen = false;

                // Reset sidebar state
                this.activeItem = 'home';
                this.openSubmenus = {
                    profile: false,
                    notifications: false
                };

                // Redirect to login page
                localStorage.clear();
                localStorage.setItem('isAuthenticated', 'false');
                this.$router.replace('/');

                // Optional: Show logout message
                setTimeout(() => {
                    alert('You have been logged out successfully.');
                }, 100);
            }
        }
    },
    mounted() {
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.isMobileMenuOpen = false;
            }
        });
    },
    beforeUnmount() {
        // Clean up event listener and timeout
        window.removeEventListener('resize', () => { });
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
    }
}
</script>

<style scoped>
.sidebar-container {
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mobile Overlay */
.mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
    display: none;
}

/* Sidebar */
.sidebar {
    width: 280px;
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    position: relative;
    z-index: 999;
    height: 100vh;
    min-height: 100vh;
}

.sidebar.sidebar-collapsed {
    width: 60px;
}

/* Sidebar Header */
.sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-icon {
    font-size: 1.5rem;
    width: 145px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #345678;
    border-radius: 8px;
    color: white;
    transition: all 0.3s ease;
}

.logo-text {
    font-weight: 600;
    color: #345678;
    font-size: 1.1rem;
}

/* Navigation */
.sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
}

.nav-section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: #a0aec0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
    padding: 0 1rem;
}

.nav-item {
    margin-bottom: 0.25rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    margin: 0 0.5rem;
    position: relative;
}

.nav-link:hover {
    background: #e2e8f0;
    color: #2d3748;
}

.nav-item.active .nav-link {
    background: #345678;
    color: white;
}

.icon {
    font-size: 1.25rem;
    width: 20px;
    text-align: center;
}

.arrow {
    margin-left: auto;
    font-size: 0.75rem;
    transition: transform 0.2s ease;
}

.arrow-open {
    transform: rotate(180deg);
}

/* Submenu */
.submenu {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: #f1f5f9;
    margin: 0 0.5rem;
    border-radius: 8px;
    margin-top: 0.25rem;
}

.submenu-open {
    max-height: 200px;
}

.submenu-item {
    padding: 0.5rem 1rem 0.5rem 3rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.submenu-item:hover {
    background: #e2e8f0;
    color: #2d3748;
}

.submenu-item:first-child {
    padding-top: 0.75rem;
}

.submenu-item:last-child {
    padding-bottom: 0.75rem;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1rem 0;
    border-top: 1px solid #e9ecef;
    margin-top: auto;
    flex-shrink: 0;
    /* Prevent it from shrinking */
}

.logout-item {
    margin-bottom: 0;
}

.logout-item .logout-link {
    color: #dc3545;
    font-weight: 500;
}

.logout-item .logout-link:hover {
    background: #f8d7da;
    color: #721c24;
}

/* Make sure logout shows in collapsed state */
.sidebar-collapsed .sidebar-footer {
    padding: 1rem 0.5rem;
}

/* Sidebar Toggle */
.sidebar-toggle {
    padding: 1rem;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease;
}

.sidebar-toggle:hover {
    background: #f1f5f9;
}

/* Main Content */
.mobile-menu-btn {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    display: none;
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    flex-direction: column;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu-btn span {
    width: 20px;
    height: 2px;
    background: #4a5568;
    transition: 0.3s;
}

/* Responsive Design */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        top: 0;
        left: -280px;
        height: 100vh;
        z-index: 999;
    }

    .sidebar-mobile-open {
        left: 0;
    }

    .mobile-overlay {
        display: block;
    }

    .mobile-menu-btn {
        display: flex;
    }

    .sidebar-toggle {
        display: none;
    }
}

/* Collapsed State */
@media (min-width: 769px) {
    .sidebar.sidebar-collapsed {
        width: 60px;
    }

    .sidebar-collapsed .logo-text,
    .sidebar-collapsed .section-title,
    .sidebar-collapsed .arrow,
    .sidebar-collapsed .submenu {
        display: none;
    }

    .sidebar-collapsed .nav-link {
        justify-content: center;
        padding: 0.75rem 0.5rem;
    }

    .sidebar-collapsed .sidebar-header {
        padding: 1rem 0.5rem;
    }

    .sidebar-collapsed .sidebar-footer {
        padding: 1rem 0.5rem;
    }

    .sidebar-collapsed .logo {
        justify-content: center;
    }

    .sidebar-collapsed .logo-icon {
        width: 40px;
        height: 40px;
    }
}
</style>