export const getActivityDate = (date: Date) => {
    const currentDate = new Date();
    if (date.getFullYear() === currentDate.getFullYear()) {
        if (date.getMonth() === currentDate.getMonth()) {
            if (date.getDate() === currentDate.getDate()) {
                if (date.getHours() === currentDate.getHours()) {
                    //same hour
                    const minutes = Math.abs(currentDate.getMinutes() - date.getMinutes())
                    if (minutes < 2) {
                        return 'Just now'
                    }
                    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
                }
                //same day
                const hours = Math.abs(currentDate.getHours() - date.getHours())
                return `${hours} hour${hours > 1 ? 's' : ''} ago`
            }
            //same month
            const days = Math.abs(currentDate.getDate() - date.getDate())
            return `${days} day${days > 1 ? 's' : ''} ago`
        }
        //same year
        const months = Math.abs(currentDate.getMonth() - date.getMonth())
        return `${months} month${months > 1 ? 's' : ''} ago`
    } else {
        //different year
        const years = currentDate.getFullYear() - date.getFullYear()
        return `${years} year${years > 1 ? 's' : ''} ago`
    }
}