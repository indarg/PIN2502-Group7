
type TConfirmationModal = {
    message?:string,
    action: () => void,
    show: boolean,
    redirectTo?:string
}

export default TConfirmationModal;
