import { observer } from "mobx-react-lite";
import { newPriorities } from "../services/api.service";
import prioritiesStore from "../store/priorities.store";
import authStore from "../store/auth.store";
import AddEntity from "./AddEntity";

const AddPriority: React.FC = observer(() => {
    return (
        <AddEntity
            title="הוסף עדיפות חדשה"
            placeholder="שם העדיפות החדשה"
            successMsg="עדיפות חדשה נוספה בהצלחה!"
            errorMsg="שגיאה בהוספת העדיפות"
            onAdd={(name) => newPriorities(name, authStore.token!)}
            onSuccess={(p) => prioritiesStore.addPriority(p)}
            checkExists={(name) => prioritiesStore.priorities.some(p => p.name.toLowerCase() === name.toLowerCase())}
            existsMsg="עדיפות בשם זה כבר קיימת"
            queryKey="priorities"
        />
    );
});

export default AddPriority;

