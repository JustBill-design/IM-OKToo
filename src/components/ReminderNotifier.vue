<template>
  <!-- This component renders nothing visible -->
  <div style="display: none;"></div>
</template>

<script>
export default {
  name: "ReminderNotifier",
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const now = new Date();
    const thresholds = [
      { label: "3d", ms: 3 * 24 * 60 * 60 * 1000 },
      { label: "1d", ms: 1 * 24 * 60 * 60 * 1000 },
      { label: "3h", ms: 3 * 60 * 60 * 1000 },
      { label: "1h", ms: 1 * 60 * 60 * 1000 },
    ];

    this.events.forEach((event) => {
      const eventTime = new Date(event.startTime);

      thresholds.forEach((t) => {
        const notifyTime = new Date(eventTime.getTime() - t.ms);
        const diff = notifyTime - now;

        if (diff <= 0 && Math.abs(diff) < 10 * 60 * 1000) {
          this.sendNotification(event, t.label);
        } else if (diff > 0) {
          setTimeout(() => this.sendNotification(event, t.label), diff);
        }
      });
    });
  },
  methods: {
    sendNotification(event, label) {
      if (Notification.permission === "granted") {
        const notif = new Notification(`Appointment in ${label}`, {
          body: `${event.title} at ${new Date(event.startTime).toLocaleTimeString()}`,
          data: { url: event.calendarLink },
        });
        notif.onclick = (e) => {
          window.open(e.target.data.url, "_blank");
        };
      }
    },
  },
};
</script>
