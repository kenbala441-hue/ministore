// AuthorStack.js
import { createStackNavigator } from '@react-navigation/stack';
import AuthorDashboard from '../screens/author/AuthorDashboard';
import AuthorApplyScreen from '../screens/author/AuthorApplyScreen';
import AuthorContractScreen from '../screens/author/AuthorContractScreen';
import AuthorSubmissionScreen from '../screens/author/AuthorSubmissionScreen';
import AuthorStatsScreen from '../screens/author/AuthorStatsScreen';

const Stack = createStackNavigator();

export default function AuthorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthorDashboard" component={AuthorDashboard} />
      <Stack.Screen name="AuthorApply" component={AuthorApplyScreen} />
      <Stack.Screen name="AuthorContract" component={AuthorContractScreen} />
      <Stack.Screen name="AuthorSubmission" component={AuthorSubmissionScreen} />
      <Stack.Screen name="AuthorStats" component={AuthorStatsScreen} />
    </Stack.Navigator>
  );
}