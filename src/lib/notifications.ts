"use client";

/**
 * NotificationService
 * Simple wrapper for Web Notification API to handle permissions and alerts.
 */

export const NotificationService = {
  /**
   * Check if notifications are supported by the browser
   */
  isSupported: () => {
    return typeof window !== "undefined" && "Notification" in window;
  },

  /**
   * Get current permission status
   */
  getPermission: () => {
    if (!NotificationService.isSupported()) return "denied";
    return Notification.permission;
  },

  /**
   * Request permission from the user
   */
  requestPermission: async () => {
    if (!NotificationService.isSupported()) return "denied";
    
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission;
    }
    
    return Notification.permission;
  },

  /**
   * Send a local notification
   */
  send: (title: string, options?: NotificationOptions) => {
    if (!NotificationService.isSupported()) return;
    
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        icon: "/collegehub/logo.png", // Fallback to manifest logo
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return notification;
    }
  },

  /**
   * Send a welcome/test notification
   */
  sendWelcome: () => {
    NotificationService.send("Notifications Enabled! 🔔", {
      body: "You'll now receive updates for notices, events, and assignments.",
      tag: "welcome-notification",
    });
  }
};
