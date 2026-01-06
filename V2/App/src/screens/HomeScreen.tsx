import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar style="auto" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Good Morning,</Text>
                        <Text className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Adv. Aditya</Text>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden border border-zinc-300">
                        {/* Placeholder Avatar */}
                        <View className="flex-1 bg-zinc-300" />
                    </View>
                </View>

                {/* Hero Card */}
                <View className="px-6 mb-8">
                    <LinearGradient
                        colors={['#18181b', '#27272a']}
                        className="rounded-3xl p-6 shadow-lg shadow-zinc-300 dark:shadow-none"
                    >
                        <View className="flex-row items-start justify-between">
                            <View>
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Ionicons name="flash-outline" size={16} color="#fbbf24" />
                                    <Text className="text-amber-400 font-bold text-xs uppercase tracking-widest">Premium Active</Text>
                                </View>
                                <Text className="text-white text-xl font-bold leading-tight">Use AI Research for{'\n'}your next case.</Text>
                            </View>
                        </View>

                        <TouchableOpacity className="mt-6 bg-white self-start px-5 py-3 rounded-xl">
                            <Text className="text-zinc-900 font-bold text-sm">Start New Query</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-8">
                    <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Quick Tools</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {[
                            { title: "Research", icon: "search-outline", color: "bg-blue-500" },
                            { title: "Drafting", icon: "document-text-outline", color: "bg-purple-500" },
                            { title: "Cases", icon: "briefcase-outline", color: "bg-orange-500" },
                            { title: "Calculator", icon: "calculator-outline", color: "bg-green-500" },
                        ].map((item, index) => (
                            <TouchableOpacity key={index} className="w-[47%] bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex-row items-center gap-3">
                                <View className={`w-10 h-10 ${item.color} rounded-xl items-center justify-center opacity-90`}>
                                    <Ionicons name={item.icon as any} size={20} color="white" />
                                </View>
                                <Text className="font-semibold text-zinc-900 dark:text-white">{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Cases */}
                <View className="px-6 mb-10">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-zinc-900 dark:text-white">Recent Files</Text>
                        <TouchableOpacity><Text className="text-blue-600 font-semibold text-sm">See All</Text></TouchableOpacity>
                    </View>

                    <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-1">
                        {[1, 2, 3].map((i) => (
                            <TouchableOpacity key={i} className="p-4 flex-row items-center border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                                <View className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg items-center justify-center mr-4">
                                    <Ionicons name="document-text" size={20} color="#71717a" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-zinc-900 dark:text-white">Sharma v. State of UP</Text>
                                    <Text className="text-xs text-zinc-500">Last edited 2h ago</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#d4d4d8" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
