import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NEON_THEME } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

export default function FriendListScreen() {
    const [friends, setFriends] = useState([]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Friends</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Feather name="plus" color={NEON_THEME.colors.background} size={24} />
                </TouchableOpacity>
            </View>

            {friends.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>아직 친구가 없어요.</Text>
                    <Text style={styles.emptySubText}>오른쪽 상단 버튼을 눌러 추가해보세요.</Text>
                </View>
            ) : (
                <FlatList
                    data={friends}
                    renderItem={({ item }) => <Text>{item.name}</Text>}
                    keyExtractor={(item) => item.id}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: NEON_THEME.colors.background,
        padding: NEON_THEME.spacing.medium,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: NEON_THEME.spacing.large,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: NEON_THEME.colors.text.primary,
    },
    addButton: {
        backgroundColor: NEON_THEME.colors.secondary,
        padding: 8,
        borderRadius: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: NEON_THEME.colors.text.primary,
        fontSize: 18,
        marginBottom: 8,
    },
    emptySubText: {
        color: NEON_THEME.colors.text.secondary,
        fontSize: 14,
    },
});
