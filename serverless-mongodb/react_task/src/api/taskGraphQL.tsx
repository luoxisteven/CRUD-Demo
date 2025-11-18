import { Task, TaskFormData } from '../types/Task';
import config from '../config';

// Helper function to convert between UI status strings and GraphQL enum values
const convertStatus = {
  // Convert UI status string to GraphQL enum value string
  toGraphQL: (status: string | undefined): string | undefined => {
    if (!status) return undefined;
    switch (status) {
      case 'To Do': return 'TODO';
      case 'In Progress': return 'IN_PROGRESS';
      case 'Done': return 'DONE';
      default: return status; // fallback
    }
  },

  // No conversion needed for response data since our GraphQL schema
  // already returns the correct string values via the enum's value property
  fromGraphQL: (task: any): any => task // Just pass through as is
};

export const taskApi = {
  // Helper function to make GraphQL requests with base URL fallback
  async graphqlRequest(query: string, variables: Record<string, any> = {}): Promise<any> {
    let lastError: any = null;
    for (const base of config.apiUrls) {
      try {
        const response = await fetch(`${base}/task`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
          lastError = new Error(`GraphQL request failed: HTTP ${response.status} ${response.statusText}`);
          continue;
        }

        const responseData = await response.json();
        if (responseData.errors) {
          lastError = new Error(`GraphQL errors: ${JSON.stringify(responseData.errors)}`);
          continue;
        }
        return responseData.data;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError ?? new Error('All GraphQL endpoints failed');
  },

  // Get all tasks
  async getAll(): Promise<Task[]> {
    const query = `
      query GetAllTasks {
        tasks {
          id
          title
          description
          status
          createdAt
          updatedAt
        }
      }
    `;
    const data = await this.graphqlRequest(query);
    return data.tasks;
  },

  // Get a task by ID
  async getById(id: number): Promise<Task> {
    const query = `
      query GetTask($id: ID!) {
        task(id: $id) {
          id
          title
          description
          status
          createdAt
          updatedAt
        }
      }
    `;
    const variables = { id };
    const data = await this.graphqlRequest(query, variables);
    return data.task;
  },

  // Create a new task
  async create(task: TaskFormData): Promise<Task> {
    const query = `
      mutation CreateTask($title: String!, $description: String, $status: TaskStatus) {
        createTask(title: $title, description: $description, status: $status) {
          id
          title
          description
          status
          createdAt
          updatedAt
        }
      }
    `;
    const variables = {
      title: task.title,
      description: task.description,
      status: convertStatus.toGraphQL(task.status),
    };
    const data = await this.graphqlRequest(query, variables);
    return data.createTask;
  },

  // Update a task
  async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
    const query = `
      mutation UpdateTask($id: ID!, $title: String, $description: String, $status: TaskStatus) {
        updateTask(id: $id, title: $title, description: $description, status: $status) {
          id
          title
          description
          status
          createdAt
          updatedAt
        }
      }
    `;
    const variables = {
      id,
      title: task.title,
      description: task.description,
      status: convertStatus.toGraphQL(task.status),
    };
    const data = await this.graphqlRequest(query, variables);
    return data.updateTask;
  },

  // Delete a task
  async delete(id: number): Promise<void> {
    const query = `
      mutation DeleteTask($id: ID!) {
        deleteTask(id: $id) {
          id
        }
      }
    `;
    const variables = { id };
    await this.graphqlRequest(query, variables);
  },
};

// import axios from 'axios';
// import { Task, TaskFormData } from '../types/Task';
// import config from '../config';

// // Helper function to convert between UI status strings and GraphQL enum values
// const convertStatus = {
//   // Convert UI status string to GraphQL enum value string
//   toGraphQL: (status: string | undefined): string | undefined => {
//     if (!status) return undefined;
//     // return status;
//     switch (status) {
//       case 'To Do': return 'TODO';
//       case 'In Progress': return 'IN_PROGRESS';
//       case 'Done': return 'DONE';
//       default: return status; // fallback
//     }
//   },
  
//   // No conversion needed for response data since our GraphQL schema
//   // already returns the correct string values via the enum's value property
//   fromGraphQL: (task: any): any => task // Just pass through as is
// };

// export const taskApi = {
//   // Get all tasks
//   async getAll(): Promise<Task[]> {
//     const response = await axios.post(`${config.apiUrl}/task`, {
//       query: `
//         query GetAllTasks {
//           tasks {
//             id
//             title
//             description
//             status
//             createdAt
//             updatedAt
//           }
//         }
//       `
//     });
    
//     return response.data.data.tasks;
//   },

//   // Get a task by ID
//   async getById(id: number): Promise<Task> {
//     const response = await axios.post(`${config.apiUrl}/task`, {
//       query: `
//         query GetTask($id: ID!) {
//           task(id: $id) {
//             id
//             title
//             description
//             status
//             createdAt
//             updatedAt
//           }
//         }
//       `,
//       variables: { id }
//     });
    
//     return response.data.data.task;
//   },

//   // Create a new task
//   async create(task: TaskFormData): Promise<Task> {
//     const response = await axios.post(`${config.apiUrl}/task`, {
//       query: `
//         mutation CreateTask($title: String!, $description: String, $status: TaskStatus) {
//           createTask(title: $title, description: $description, status: $status) {
//             id
//             title
//             description
//             status
//             createdAt
//             updatedAt
//           }
//         }
//       `,
//       variables: {
//         title: task.title,
//         description: task.description,
//         status: convertStatus.toGraphQL(task.status)
//       }
//     });
    
//     return response.data.data.createTask;
//   },

//   // Update a task
//   async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
//     const response = await axios.post(`${config.apiUrl}/task`, {
//       query: `
//         mutation UpdateTask($id: ID!, $title: String, $description: String, $status: TaskStatus) {
//           updateTask(id: $id, title: $title, description: $description, status: $status) {
//             id
//             title
//             description
//             status
//             createdAt
//             updatedAt
//           }
//         }
//       `,
//       variables: {
//         id,
//         title: task.title,
//         description: task.description,
//         status: convertStatus.toGraphQL(task.status)
//       }
//     });
    
//     return response.data.data.updateTask;
//   },

//   // Delete a task
//   async delete(id: number): Promise<void> {
//     await axios.post(`${config.apiUrl}/task`, {
//       query: `
//         mutation DeleteTask($id: ID!) {
//           deleteTask(id: $id) {
//             id
//           }
//         }
//       `,
//       variables: { id }
//     });
//   }
// };