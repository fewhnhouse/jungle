import { useRouter } from 'next/router'
import { useCallback } from 'react'

function useQueryState<T>(key: string, initialValue?: T) {
    const { query, replace, pathname } = useRouter()

    const storedString = query[key]
    const storedValue = storedString
        ? (JSON.parse(storedString as string) as T)
        : undefined

    const setQueryState = useCallback(
        (value: T | ((value: T) => T)) => {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            const stringValue = JSON.stringify(valueToStore)

            replace({
                pathname,
                query: { ...query, [key]: stringValue },
            })
        },
        [key, query]
    )

    return [
        query[key] ? JSON.parse(query[key] as string) : initialValue,
        setQueryState,
    ] as const
}

export default useQueryState
