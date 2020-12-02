import { useEffect, useState } from 'react'

// Checks if browser supports Notification Promise
const checkNotificationPromise = () => {
    try {
        Notification.requestPermission().then()
    } catch (e) {
        return false
    }

    return true
}

const useNotifications = () => {
    const [permission, setPermission] = useState<
        'denied' | 'default' | 'granted'
    >('default')
    // function to actually ask the permissions
    function handlePermission(permission) {
        const isSupported = 'Notification' in window
        setPermission(permission)
        // make sure Browser stores the information
        if (isSupported && !('permission' in Notification)) {
            (Notification as any).permission = permission
        }
    }

    useEffect(() => {
        const isSupported = 'Notification' in window
        if (isSupported && 'permission' in Notification) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = () => {
        if (permission === 'default') {
            // check if the browser supports notifications
            if (!('Notification' in window)) {
                console.log('This browser does not support notifications.')
            } else {
                if (checkNotificationPromise()) {
                    Notification.requestPermission().then((permission) => {
                        handlePermission(permission)
                        return permission
                    })
                } else {
                    Notification.requestPermission(function (permission) {
                        handlePermission(permission)
                        return permission
                    })
                }
            }
        } else {
            return permission
        }
    }

    return { permission, requestPermission }
}

export default useNotifications
