<template>
    <div>
        <menu-bar :user="username" :role="role" :profileImageUrl="profileImageUrl" @logout="logout" />
        <div class="admin-panel">
            <h1>Admin Panel</h1>
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="supersuperuser" :key="supersuperuser.username">
                        <td>{{ supersuperuser.username }}</td>
                        <td>{{ supersuperuser.role }}</td>
                        <td>
                            <button :disabled="true" class="action-button">Zum Superuser machen</button>
                            <button :disabled="true" class="action-button">Zum User machen</button>
                            <button :disabled="true" class="delete-button-user">Nutzer löschen</button>
                        </td>
                    </tr>
                    <tr v-for="user in filteredUsers" :key="user.username">
                        <td>{{ user.username }}</td>
                        <td>{{ user.role }}</td>
                        <td>
                            <button @click="assignRole(user.username, 'superuser')" class="action-button">Zum Superuser machen</button>
                            <button @click="assignRole(user.username, 'user')" class="action-button">Zum User machen</button>
                            <button @click="deleteUser(user.username)" class="delete-button-user">Nutzer löschen</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="error" class="error-message">{{ error }}</div>
        </div>
    </div>
</template>

<script>
import MenuBar from '@/components/MenuBar.vue';
import axios from 'axios';

export default {
    components: {
        MenuBar 
    },
    data() {
        return {
            users: [],
            role: localStorage.getItem('role') || '',
            username: localStorage.getItem('username') || '',
            error: null
        };
    },
    computed: {
        filteredUsers() {
            return this.users.filter(user => user.username !== 'supersuperuser');
        },
        supersuperuser() {
            return this.users.find(user => user.username === 'supersuperuser');
        }
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            axios.get('http://localhost:8002/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            })
                .then(response => {
                    const users = response.data;
                    users.sort((a, b) => {
                        if (a.role === 'supersuperuser' && b.role !== 'supersuperuser') {
                            return -1;
                        } else if (a.role !== 'supersuperuser' && b.role === 'supersuperuser') {
                            return 1;
                        } else {
                            return a.username.localeCompare(b.username);
                        }
                    });

                    this.users = users;
                })
                .catch(() => {
                    console.error('Fehler beim Abrufen der Benutzerliste');
                });
        },
        assignRole(username, role) {
            axios.post('http://localhost:8002/api/assignRole', { username, role }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            })
                .then(() => {
                    this.fetchUsers();
                })
                .catch(() => {
                    console.error('Fehler beim Zuweisen der Rolle');
                    this.error = 'Fehler beim Zuweisen der Rolle';
                });
        },
        logout() {
            localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('vorname');
      localStorage.removeItem('nachname');
      localStorage.removeItem('birthdate');
      localStorage.removeItem('profileImageUrl');
            this.user = null;
            this.$router.push('/');
        },
        deleteUser(username) {
            axios.delete(`http://localhost:8002/api/users/${username}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            })
                .then(() => {
                    this.fetchUsers();
                })
                .catch(() => {
                    console.error('Fehler beim Löschen des Benutzers');
                    this.error = 'Fehler beim Löschen des Benutzers';
                });
        }
    }
};
</script>

<style scoped>
.admin-panel {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.user-table th,
.user-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
}

.user-table th {
    background-color: #577B8D;
    color: white;
    font-weight: bold;
}

.user-table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.user-table tr:hover {
    background-color: #e0f7fa;
}

.action-button {
    background-color: #577B8D;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 8px;
}

.action-button:last-child {
    margin-right: 0;
}

.action-button:hover {
    background-color: #2A629A;
}

.error-message {
    color: red;
    margin-top: 10px;
}

.delete-button-user {
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-right: 8px;
    background-color: #d9534f;
}

.delete-button-user:hover {
    background-color: #c9302c;
}

.user-table tr:first-child .action-button {
    cursor: not-allowed;
    background-color: #ccc;
}

.user-table tr:first-child .action-button:hover {
    background-color: #ccc;
}
</style>
