import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EventForm from '../EventForm.vue'
import { nextTick } from 'vue'
import { CalendarDate } from '@internationalized/date'

describe('EventForm.vue component existence test', () => {
  let fetchMock: any

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn((key) => {
        if (key === 'username') return 'testuser'
        if (key === 'email') return 'test@example.com'
        return null
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    fetchMock = vi.fn().mockResolvedValue({ 
      ok: true,
      json: () => Promise.resolve({}) 
    })
    global.fetch = fetchMock
  })

  it('renders all form components', async () => {
    const wrapper = mount(EventForm, {attachTo: document.body})

    // Check that the main form exists
    expect(wrapper.find('form').exists()).toBe(true)

    // 1. Check that the Event Title field exists
    expect(wrapper.findComponent({ name: 'EventTitle' }).exists()).toBe(true)
    expect(wrapper.find('input[name="title"]').exists()).toBe(true)

    // 2. Check that the Event Category field exists as well as all its options
    expect(wrapper.findComponent({ name: 'EventCategory' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="category-trigger"]').exists()).toBe(true)
    await wrapper.find('[data-testid="category-trigger"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Appointments')
    expect(wrapper.text()).toContain('Chores & Household Tasks')
    expect(wrapper.text()).toContain('Medication & Health Management')
    expect(wrapper.text()).toContain('Rest & Wellness')

    // 3. Check that the Event Elderly field exists as well as all its options
    expect(wrapper.findComponent({ name: 'EventElderly' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="elderly-trigger"]').exists()).toBe(true)
    await wrapper.find('[data-testid="elderly-trigger"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Sally')
    expect(wrapper.text()).toContain('June')

    // 4. Check that the Event Start Date and End Date field exists
    expect(wrapper.findComponent({ name: 'EventDateTimeRange' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="start-trigger-calendar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="end-trigger-calendar"]').exists()).toBe(true)

    // 5. Check that the Event Start Time and End Time field exists as well as its options
    expect(wrapper.find('[data-testid="startTime-trigger"]').exists()).toBe(true)
    await wrapper.find('[data-testid="startTime-trigger"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('00:00')

    expect(wrapper.find('[data-testid="endTime-trigger"]').exists()).toBe(true)
    await wrapper.find('[data-testid="endTime-trigger"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('00:00')

    // 6. Check that the Event Guests field exists
    expect(wrapper.findComponent({ name: 'EventGuest' }).exists()).toBe(true)
    expect(wrapper.find('input[name="guests"]').exists()).toBe(true)

    // 7. Check that the Event Location field exists
    expect(wrapper.findComponent({ name: 'EventLocation' }).exists()).toBe(true)
    expect(wrapper.find('input[name="location"]').exists()).toBe(true)

    // 8. Check that the Event Description field exists
    expect(wrapper.findComponent({ name: 'EventDescription' }).exists()).toBe(true)
    expect(wrapper.find('textarea[placeholder="Add Description"]').exists()).toBe(true)

    // 9. Check that the Event Recurrence field exists as well as its options
    expect(wrapper.findComponent({ name: 'EventRecurrence' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="recurrence-trigger"]').exists()).toBe(true)
    await wrapper.find('[data-testid="recurrence-trigger"]').trigger('click')
    await nextTick()
    expect(wrapper.text()).toContain('Does not repeat')
    expect(wrapper.text()).toContain('Daily')
    expect(wrapper.text()).toContain('Weekly on this day')
    expect(wrapper.text()).toContain('Monthly on this day')
    expect(wrapper.text()).toContain('Every weekday')
    expect(wrapper.text()).toContain('Anually on this day')

    // Check that submit button exists
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Create Event')

    // Check form title
    expect(wrapper.find('h2').text()).toBe('Create Event')
  })

  it('has correct form structure', () => {
    const wrapper = mount(EventForm)

    // Check form is present
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    
  })

  it('can access form instance', () => {
    const wrapper = mount(EventForm)

    // Check that vee-validate form is properly initialized
    expect(wrapper.vm.form).toBeDefined()
    expect(typeof wrapper.vm.form.handleSubmit).toBe('function')
    expect(typeof wrapper.vm.form.setFieldValue).toBe('function')
    expect(typeof wrapper.vm.form.validate).toBe('function')
  })

  it('validates required fields correctly', async () => {
    const wrapper = mount(EventForm, {
      global: {
        stubs: {
          EventTitle: true,
          EventCategory: true,
          EventElderly: true,
          EventDateTimeRange: true,
          EventGuest: true,
          EventLocation: true,
          EventDescription: true,
          EventRecurrence: true
        }
      }
    })

    const form = wrapper.vm.form

    // Test validation with empty form
    const { valid: emptyFormValid, errors: emptyFormErrors } = await form.validate()
    expect(emptyFormValid).toBe(false)
    expect(Object.keys(emptyFormErrors)).toContain('title')
    expect(Object.keys(emptyFormErrors)).toContain('category')
    expect(Object.keys(emptyFormErrors)).toContain('elderly')

    // Test with valid data
    await form.setFieldValue('title', 'Test Event')
    await form.setFieldValue('category', 'Appointments')
    await form.setFieldValue('elderly', 'Sally')
    await form.setFieldValue('startDate', {
      era: 'AD',
      year: 2025,
      month: 8,
      day: 6
    })
    await form.setFieldValue('startTime', '10:00')
    await form.setFieldValue('endDate', {
      era: 'AD',
      year: 2025,
      month: 8,
      day: 6
    })
    await form.setFieldValue('endTime', '11:00')

    const { valid: validFormValid, errors: validFormErrors } = await form.validate()
    expect(validFormValid).toBe(true)
    expect(Object.keys(validFormErrors)).toHaveLength(0)
  })

  // it('validates date constraints correctly', async () => {
  //   const wrapper = mount(EventForm, {
  //     global: { stubs: { /* stub all components */ } }
  //   })

  //   const form = wrapper.vm.form

  //   // Test past date validation
  //   const pastDate = new CalendarDate(2020, 1, 1)
  //   await form.setFieldValue('startDate', pastDate)
    
  //   const { errors } = await form.validate()
  //   expect(errors.startDate).toContain('Start date cannot be in the past')
  // })

  // it('validates end date is not before start date', async () => {
  //   const wrapper = mount(EventForm, {
  //     global: { stubs: { /* stub all components */ } }
  //   })

  //   const form = wrapper.vm.form

  //   // Set start date after end date
  //   await form.setFieldValue('startDate', new CalendarDate(2025, 8, 10))
  //   await form.setFieldValue('endDate', new CalendarDate(2025, 8, 5))
  //   await form.setFieldValue('startTime', '10:00')
  //   await form.setFieldValue('endTime', '11:00')

  //   const { errors } = await form.validate()
  //   expect(errors.endDate).toContain('End date must not be before start date')
  // })

  // it('validates same day time constraints', async () => {
  //   const wrapper = mount(EventForm, {
  //     global: { stubs: { /* stub all components */ } }
  //   })

  //   const form = wrapper.vm.form

  //   // Same day but end time before start time
  //   const sameDate = new CalendarDate(2025, 8, 5)
  //   await form.setFieldValue('startDate', sameDate)
  //   await form.setFieldValue('endDate', sameDate)
  //   await form.setFieldValue('startTime', '15:00')
  //   await form.setFieldValue('endTime', '10:00') // Earlier than start

  //   const { errors } = await form.validate()
  //   expect(errors.endDate).toContain('End time must not be equal or before start time')
  // })

  // it('validates guest email format', async () => {
  //   const wrapper = mount(EventForm, {
  //     global: { stubs: { /* stub all components */ } }
  //   })

  //   const form = wrapper.vm.form

  //   // Invalid email format
  //   await form.setFieldValue('guests', 'invalid-email, another-invalid')

  //   const { errors } = await form.validate()
  //   expect(errors.guests).toContain('Emails provided are invalid')

  //   // Valid email format
  //   await form.setFieldValue('guests', 'test@example.com, another@test.com')

  //   const { errors: validErrors } = await form.validate()
  //   expect(validErrors.guests).toBeUndefined()
  // })

})
