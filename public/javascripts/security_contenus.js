      // Security Utils
      const SecurityUtils = {
        escapeHtml(unsafe) {
          return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        },

        validateId(id) {
          return /^[a-zA-Z0-9-_]+$/.test(id);
        },

        validateYoutubeUrl(url) {
          const youtubeRegex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/;
          return youtubeRegex.test(url);
        },

        getCsrfToken() {
          return document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        },

        getHeaders() {
          return {
            "Content-Type": "application/json",
            "X-CSRF-Token": this.getCsrfToken(),
          };
        },
      };

      // Rate Limiter
      const RateLimiter = {
        limits: {},

        canPerformAction(action, minInterval = 1000) {
          const now = Date.now();
          if (this.limits[action] && now - this.limits[action] < minInterval) {
            return false;
          }
          this.limits[action] = now;
          return true;
        },
      };

      export { SecurityUtils, RateLimiter };