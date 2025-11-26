import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Modal, Portal, Text, TextInput, Divider } from 'react-native-paper';
import { saveRoom } from '../api/rooms';

export default function RoomForm({ visible, onDismiss, initialValues = {}, onSaved }) {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formFields = [
        { key: 'RoomAlise', label: 'Room Alias' },
        { key: 'RoomName', label: 'Room Name' },
        { key: 'RoomTypeId', label: 'Room Type ID', numeric: true },
        { key: 'RFloorId', label: 'Floor ID', numeric: true },
        { key: 'DisplayIndex', label: 'Display Index', numeric: true },
        { key: 'Discription', label: 'Description', multiline: true },
    ];

    useEffect(() => {
        setForm({
            RoomID: initialValues?.RoomID || null,
            RoomAlise: initialValues?.RoomAlise || '',
            RoomName: initialValues?.RoomName || '',
            RoomTypeId: initialValues?.RoomTypeId?.toString() || '',
            RFloorId: initialValues?.RFloorId?.toString() || '',
            DisplayIndex: initialValues?.DisplayIndex?.toString() || '',
            Discription: initialValues?.Discription || '',
        });
    }, [initialValues]);

    const setField = (key, value) => setForm({ ...form, [key]: value });

    const validate = () => {
        if (!form.RoomAlise.trim()) return 'RoomAlias is required';
        if (!form.RoomName.trim()) return 'RoomName is required';
        if (!form.RoomTypeId) return 'RoomTypeId is required';
        if (!form.RFloorId) return 'RFloorId is required';
        return null;
    };

    const handleSubmit = async () => {
        const err = validate();
        if (err) return setError(err);

        setLoading(true);
        setError('');

        try {
            const payload = {
                ...form,
                action_flag: 1,
                RoomTypeId: parseInt(form.RoomTypeId, 10),
                RFloorId: parseInt(form.RFloorId, 10),
                DisplayIndex: parseInt(form.DisplayIndex || 0, 10),
                CreatedBy: 101,
            };

            const res = await saveRoom(payload);
            const success = res?.result?.[0]?.Success ?? true;

            if (success) {
                onSaved?.();
                onDismiss();
            } else setError(res?.result?.[0]?.Message || 'Save failed');
        } catch (e) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modal}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <Text style={styles.title}>
                            {form.RoomID ? 'Edit Room' : 'Add New Room'}
                        </Text>

                        <Divider style={{ marginBottom: 16 }} />

                        {formFields.map(({ key, label, numeric, multiline }) => (
                            <TextInput
                                key={key}
                                label={label}
                                mode="outlined"
                                value={form[key]?.toString()}
                                onChangeText={(t) => setField(key, t)}
                                keyboardType={numeric ? 'number-pad' : 'default'}
                                multiline={!!multiline}
                                style={styles.input}
                            />
                        ))}

                        {error ? <HelperText type="error">{error}</HelperText> : null}

                        <View style={styles.actions}>
                            <Button mode="outlined" onPress={onDismiss} style={styles.btn}>
                                Cancel
                            </Button>
                            <Button mode="contained" onPress={handleSubmit} loading={loading} style={styles.btn}>
                                {form.RoomID ? 'Save' : 'Create'}
                            </Button>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 12,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    input: {
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 20,
    },
    btn: {
        minWidth: 120,
    },
});
