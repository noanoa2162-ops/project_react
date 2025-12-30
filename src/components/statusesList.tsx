import { observer } from "mobx-react-lite";
import statusesStore from "../store/status.store";
import { getStatuses } from "../services/api.service";
import authStore from "../store/auth.store";
import EntityList from "./EntityList";

const StatusesList: React.FC = observer(() => {
    return (
        <EntityList
            title="סטטוסים קיימים"
            emptyMsg="אין סטטוסים"
            queryKey="statuses"
            fetchFn={() => getStatuses(authStore.token!)}
            onFetchSuccess={(data) => statusesStore.setStatuses(data)}
            entities={statusesStore.statuses}
            icon="🔄"
        />
    );
});

export default StatusesList;
