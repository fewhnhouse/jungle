export const getNameInitials = (name: string) => {
    return name?.split(' ').reduce((prev, curr) => prev + curr.charAt(0), '') ?? ''
}