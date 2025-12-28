import { useQuery } from "@tanstack/react-query";
import authStore from "../store/auth.store";
import usersStore from "../store/users.store";
import { getUsers } from "../services/api.service";

const AgentsList = () => {
  console.log('AgentsList mounted, token:', authStore.token);
  
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(authStore.token!),
    enabled: !!authStore.token,
    staleTime: Infinity,
  });


  
  if (users && users.length > 0) {
    usersStore.setUsers(users);
  }


  return null;
};

export default AgentsList;




