import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Appointments from '../UpcomingAppointments.vue' // change to your actual component file path
import { nextTick } from 'vue'

const mockEvents = [
  {
    event_id: '1',
    title: 'Doctor Visit',
    start: new Date().toISOString(), // today's date
    end: new Date().toISOString(),
    location: 'Clinic',
    description: 'Annual checkup',
    category: 'Appointments',
  },
  {
    event_id: '2',
    title: 'Past Event',
    start: '2024-01-01T10:00:00Z',
    end: '2024-01-01T11:00:00Z',
    location: 'Office',
    description: 'Old event',
    category: 'Appointments',
  }
]

beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn(() => 'alice@example.com'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockEvents),
  })
})

describe('UpcomingAppointments.vue', () => {
  it('shows no appointments message when there are no today appointments', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { ...mockEvents[1] },
      ]),
    })

    const wrapper = mount(Appointments)
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('No appointments today.')
  })

  it('renders today appointments correctly', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { ...mockEvents[0] },
      ]),
    })

    const wrapper = mount(Appointments)

    await nextTick()
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('Doctor Visit')
    expect(wrapper.text()).toContain('Clinic')
    expect(wrapper.text()).toContain('Annual checkup')
  })

  it('renders correct number of today events', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { ...mockEvents[0] },
      ]),
    })
    
    const wrapper = mount(Appointments)

    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.event-card').length).toBe(1) 
  })
})
