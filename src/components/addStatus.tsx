import { observer } from "mobx-react-lite";
import { newStatuses } from "../services/api.service";
import statusesStore from "../store/status.store";
import authStore from "../store/auth.store";
import AddEntity from "./AddEntity";

const AddStatus: React.FC = observer(() => {
    return (
        <AddEntity
            title="הוסף סטטוס חדש"
            placeholder="הכנס שם סטטוס"
            successMsg="סטטוס חדש הוסף בהצלחה!"
            errorMsg="שגיאה בהוספת הסטטוס"
            onAdd={(name) => newStatuses(name, authStore.token!)}
            onSuccess={(s) => statusesStore.addStatus(s)}
            checkExists={(name) => statusesStore.statuses.some(s => s.name.toLowerCase() === name.toLowerCase())}
            existsMsg="סטטוס בשם זה כבר קיים"
            queryKey="statuses"
        />
    );
});

export default AddStatus;