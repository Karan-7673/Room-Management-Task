import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text } from 'react-native-paper';
import { getRoomList, saveRoom } from '../api/rooms';
import RoomForm from '../ScreenComponents/RoomForm';

export default function RoomsList({ navigation }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [error, setError] = useState('');

    const loadRooms = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const r = await getRoomList();
            setRooms(r);
        } catch (e) {
            setError(e.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRooms();
    }, [loadRooms]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const r = await getRoomList();
            setRooms(r);
        } catch (e) {
            setError(e.message || 'Refresh failed');
        } finally {
            setRefreshing(false);
        }
    };

    async function handleDelete(room) {
        Alert.alert(
            'Delete Room',
            `Soft-delete ${room.RoomName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await saveRoom({ action_flag: 3, RoomID: room.RoomID });
                            await loadRooms();
                        } catch (e) {
                            Alert.alert('Error', e.message || 'Delete failed');
                        }
                    }
                }
            ]
        );
    }

    const openAdd = () => {
        setEditRoom(null);
        setFormVisible(true);
    };

    const openEdit = (room) => {
        setEditRoom(room);
        setFormVisible(true);
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="elevated">
            <Card.Title
                title={item.RoomName}
                subtitle={`${item.RoomAlise} • Floor ${item.RFloorId}`}
                titleStyle={{ fontSize: 18, fontWeight: '600' }}
            />
            <Divider />
            <Card.Content style={{ marginTop: 10 }}>
                <Text style={styles.infoText}>Room ID: {item.RoomID}</Text>
                <Text style={styles.infoText}>Type: {item.RoomTypeId}</Text>
                <Text style={styles.infoText}>Display Index: {item.DisplayIndex}</Text>
                {item.Discription ? (
                    <Text style={[styles.infoText, { marginTop: 4 }]}>
                        {item.Discription}
                    </Text>
                ) : null}
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
                <Button mode="text" onPress={() => openEdit(item)}>
                    Modify
                </Button>
                <Button mode="text" textColor="red" onPress={() => handleDelete(item)}>
                    Delete
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={{ flex: 1 }}>

            <View style={styles.header}>

                <Text style={styles.headerTitle}>Active Rooms</Text>
                <Button
                    mode="contained"
                    style={styles.addButton}
                    onPress={openAdd}
                >
                    Add Room
                </Button>

            </View>

            {/* Room List Section */}
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                {loading && <ActivityIndicator size="large" style={{ marginTop: 30 }} />}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {!loading && rooms.length === 0 ? (
                    <Text style={styles.emptyText}>No active rooms found</Text>
                ) : null}

                <FlatList
                    data={rooms}
                    keyExtractor={(item) => String(item.RoomID)}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 8 }}
                />
            </View>

            {/* Room Form */}
            <RoomForm
                visible={formVisible}
                initialValues={editRoom}
                onDismiss={() => setFormVisible(false)}
                onSaved={() => loadRooms()}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',

    },
    addButton: {
        backgroundColor: '#007bff',
    },
    card: {
        marginBottom: 12,
        borderRadius: 12,
        elevation: 3,
    },
    infoText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },
    cardActions: {
        justifyContent: 'spcae-between',
        paddingRight: 14,
        paddingBottom: 6,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
    },
});
