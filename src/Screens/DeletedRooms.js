import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Button, Card, Text, Divider } from 'react-native-paper';
import { getDeletedRoomList, saveRoom } from '../api/rooms';

export default function DeletedRooms({ navigation }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    async function loadDeleted() {
        setLoading(true);
        setError('');
        try {
            const r = await getDeletedRoomList();
            setRooms(r);
        } catch (e) {
            setError(e.message || 'Failed to load deleted rooms');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDeleted();
    }, []);

    async function handleActivate(room) {
        try {
            await saveRoom({ action_flag: 4, RoomID: room.RoomID });
            await loadDeleted();
        } catch (e) {
            alert(e.message || 'Activate failed');
        }
    }

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="elevated">
            <Card.Title
                title={item.RoomName}
                subtitle={`${item.RoomAlise} • ID: ${item.RoomID}`}
                titleStyle={styles.title}
            />

            <Divider />

            <Card.Content style={{ marginTop: 10 }}>
                <Text style={styles.subText}>Type: {item.RoomTypeId}</Text>
                <Text style={styles.subText}>Floor: {item.RFloorId}</Text>

                {item.Discription ? (
                    <Text style={[styles.subText, { marginTop: 6 }]}>
                        {item.Discription}
                    </Text>
                ) : null}
            </Card.Content>

            <Card.Actions style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={() => handleActivate(item)}
                    style={styles.activateBtn}
                >
                    Activate
                </Button>
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>


            <View style={styles.header}>
                <Text style={styles.headerTitle}>Deleted Rooms</Text>

            </View>

            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                {loading && <ActivityIndicator size="large" style={{ marginTop: 30 }} />}

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {!loading && rooms.length === 0 ? (
                    <Text style={styles.emptyText}>No deleted rooms found</Text>
                ) : null}

                <FlatList
                    data={rooms}
                    keyExtractor={(item) => String(item.RoomID)}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={async () => {
                            setRefreshing(true);
                            await loadDeleted();
                            setRefreshing(false);
                        }} />
                    }
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 8 }}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        padding: 16,
        backgroundColor: '#f6f6f7',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 6,
    },

    card: {
        borderRadius: 12,
        elevation: 3,
        marginBottom: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    subText: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },

    actions: {
        justifyContent: 'flex-end',
        paddingRight: 10,
        paddingBottom: 10,
    },

    activateBtn: {
        borderRadius: 8,
    },

    errorText: {
        color: 'red',
        marginVertical: 10,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
    },
});
