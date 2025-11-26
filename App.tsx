import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import RoomsList from './src/Screens/RoomsList';
import DeletedRooms from './src/Screens/DeletedRooms';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="RoomsList"
                        component={RoomsList}
                        options={({ navigation }) => ({
                            header: () => (
                                <Appbar.Header>
                                    <Appbar.Content title="Rooms" />
                                    <Appbar.Action
                                        icon="delete"
                                        onPress={() => navigation.navigate('DeletedRooms')}

                                    />
                                </Appbar.Header>
                            ),
                        })}
                    />
                    <Stack.Screen
                        name="DeletedRooms"
                        component={DeletedRooms}
                        options={({ navigation }) => ({
                            header: () => (
                                <Appbar.Header>
                                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                                    <Appbar.Content title="Deleted Rooms" />
                                </Appbar.Header>
                            ),
                        })} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;
