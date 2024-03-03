export const isAuthenticated = async () => {
    const token = localStorage.getItem('wf-ttt');
    if (!token) {
        return false;
    }

    console.log('Token found')

    return true;
}