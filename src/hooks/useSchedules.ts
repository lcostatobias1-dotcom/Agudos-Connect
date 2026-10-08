import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Schedule } from '../types'
import { getSchedules, removeSchedule } from '../storage/schedulesStorage'

export function useSchedules() {
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        try {
            const data = await getSchedules()
            setSchedules([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
        } catch (error) {
            console.error('[useSchedules] erro ao carregar agendamentos:', error)
            setSchedules([])
        } finally {
            setLoading(false)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            load()
        }, [load])
    )

    async function cancelSchedule(id: string) {
        await removeSchedule(id)
        await load()
    }

    return { schedules, loading, cancelSchedule }
}
