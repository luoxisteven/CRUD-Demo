// Define the configuration interface
interface DBConfig {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string | undefined;
    dialect: string | undefined;
}

// Task type definition
interface TaskData {
    id: number;
    title: string;
    description?: string | null;
    status: string;
}
export {DBConfig, TaskData};