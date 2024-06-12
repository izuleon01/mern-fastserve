export class NotificationDTO {
    type: string;
    notificationData: string[];

    constructor(type: string, notificationData: string[]) {
        this.type = type;
        this.notificationData = notificationData;
    }

}
