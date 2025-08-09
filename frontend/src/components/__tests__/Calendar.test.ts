import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Calendar from '../CalendarCard.vue'

const mockEvents = [
  {
    event_id: '1',
    title: 'Team Meeting',
    start: '2025-08-05T09:00:00Z',
    end: '2025-08-05T10:00:00Z',
    caretaker: 'Alice',
    category: 'Appointments',
    recurrence: 'FREQ=DAILY;COUNT=1',
  },
]

beforeEach(() => {
  // @ts-ignore
  global.localStorage = {
    getItem: vi.fn(() => "alice@example.com"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockEvents),
  })
})

describe('CalendarCard.vue basic tests', () => {
  it('shows loading initially and then calendar after fetch', async () => {
    const wrapper = mount(Calendar, {
      global: {
        stubs: {
          ScheduleXCalendar: true,
          Teleport: true,
        }
      }
    })

    expect(wrapper.find('.sx-vue-calendar-wrapper').exists()).toBe(true)

    await nextTick()
    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.find('.sx-vue-calendar-wrapper').exists()).toBe(false)

    expect(wrapper.findComponent({ name: 'ScheduleXCalendar' }).exists()).toBe(true)

    expect(wrapper.text()).toContain('Daily Routine')
  })

  it('can open and display event popover', async () => {
    const wrapper = mount(Calendar, {
      global: {
        stubs: {
          ScheduleXCalendar: true,
          Teleport: true,
        }
      }
    })

    await nextTick()
    await nextTick()
    await nextTick()

    wrapper.vm.showPopover = true
    wrapper.vm.popoverEvent = {
      title: 'Team Meeting',
      formattedDate: 'Aug 5, 2025 9:00 AM - 10:00 AM',
      location: 'Office',
      people: ['Alice'],
      guests: 'Bob',
    }

    await nextTick()

    expect(wrapper.text()).toContain('Team Meeting')
    expect(wrapper.text()).toContain('Office')
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })
})
