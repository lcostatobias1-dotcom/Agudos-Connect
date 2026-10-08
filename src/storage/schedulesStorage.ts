import AsyncStorage from '@react-native-async-storage/async-storage'
import { Schedule } from '../types'

const SCHEDULES_KEY = '@agudos-connect:schedules'

export async function getSchedules(): Promise<Schedule[]> {
    const raw = await AsyncStorage.getItem(SCHEDULES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Schedule[]
}

export async function addSchedule(schedule: Omit<Schedule, 'id' | 'createdAt'>): Promise<Schedule> {
    const schedules = await getSchedules()
    const newSchedule: Schedule = {
        ...schedule,
        id: String(Date.now()),
        createdAt: new Date().toISOString(),
    }

    await AsyncStorage.setItem(SCHEDULES_KEY, JSON.stringify([...schedules, newSchedule]))
    return newSchedule
}

export async function removeSchedule(id: string): Promise<void> {
    const schedules = await getSchedules()
    const remaining = schedules.filter((schedule) => schedule.id !== id)
    await AsyncStorage.setItem(SCHEDULES_KEY, JSON.stringify(remaining))
}
