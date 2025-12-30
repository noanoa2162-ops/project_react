import { observer } from "mobx-react-lite";
import prioritiesStore from "../store/priorities.store";
import { getPriorities } from "../services/api.service";
import authStore from "../store/auth.store";
import EntityList from "./EntityList";

const PrioritiesList: React.FC = observer(() => {
    return (
        <EntityList
            title="עדיפויות קיימות"
            emptyMsg="אין עדיפויות"
            queryKey="priorities"
            fetchFn={() => getPriorities(authStore.token!)}
            onFetchSuccess={(data) => prioritiesStore.setPriorities(data)}
            entities={prioritiesStore.priorities}
            icon="📊"
        />
    );
});

export default PrioritiesList;
