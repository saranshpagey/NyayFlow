import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrafterScreen() {
    return (
        <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950 items-center justify-center">
            <Text className="text-zinc-900 dark:text-white font-bold text-xl">Smart Drafter</Text>
            <Text className="text-zinc-500 mt-2">Coming Soon</Text>
        </SafeAreaView>
    );
}
