import { ObjectId } from "mongodb";
import { tasks, users } from "../config/mongoCollections.js";
import { TASK_STATUSES, USER_ROLES } from "../constants.js";
import * as helpers from "../helpers.js";

const getAllTasks = async (currentUser, projectId) => {
  if (!currentUser) {
    throw new Error("You must be logged in to fetch tasks");
  }
  projectId = helpers.checkId(projectId, "Project ID");

  const findQuery = { projectId: new ObjectId(projectId) };
  if (currentUser.role === USER_ROLES.WORKER) {
    findQuery["workers._id"] = new ObjectId(currentUser._id);
  } else if (currentUser.role === USER_ROLES.GENERAL_CONTRACTOR) {
    findQuery["generalContractor._id"] = new ObjectId(currentUser._id);
  }

  const taskCollection = await tasks();
  const tasksList = await taskCollection.find(findQuery).toArray();

  if (!tasksList) {
    throw new Error("Could not fetch tasks");
  }

  return tasksList.map((task) => ({
    ...task,
    canEdit:
      task.status !== TASK_STATUSES.COMPLETED &&
      [
        USER_ROLES.GENERAL_CONTRACTOR,
        USER_ROLES.ADMIN,
        USER_ROLES.SALES_REP,
      ].includes(currentUser.role),
  }));
};

const createTask = async (
  currentUser,
  projectId,
  title,
  description,
  expectedCompletionDate,
  generalContractorId,
  workerIds
) => {
  if (!currentUser) {
    throw new Error("You must be logged in to create a task");
  }

  title = helpers.checkString(title, "title");
  description = helpers.checkString(title, "description");
  // TODO: Validate expectedCompletionDate
  generalContractorId = helpers.checkId(
    generalContractorId,
    "General Contractor Id"
  );
  workerIds = helpers.checkIdArray(workerIds, "Worker Ids");

  const userCollection = await users();
  const workers = await userCollection
    .find({
      _id: { $in: workerIds.map((id) => new ObjectId(id)) },
    })
    .toArray();
  if (!workers || workers.length !== workerIds.length) {
    throw new Error("One or more worker ids are wrong");
  }
  const generalContractor = await userCollection.findOne({
    _id: new ObjectId(generalContractorId),
  });
  if (!generalContractor) {
    throw new Error("General Contractor not available");
  }

  const taskCollection = await tasks();
  const newTask = {
    projectId: new ObjectId(projectId),
    title,
    description,
    expectedCompletionDate: new Date(expectedCompletionDate),
    generalContractor: {
      _id: generalContractor._id,
      email: generalContractor.email,
    },
    workers: workers.map(({ _id, email }) => ({ _id, email })),
    status: TASK_STATUSES.TO_DO,
    completedOn: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const insertInfo = await taskCollection.insertOne(newTask);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not create task");
  }
  const newId = insertInfo.insertedId.toString();
  const task = await getTaskById(currentUser, projectId, newId);
  return task;
};

const getTaskById = async (currentUser, projectId, taskId) => {
  if (!currentUser) {
    throw new Error("You must be logged in to fetch a task");
  }

  taskId = helpers.checkId(taskId, "Task Id");

  const findQuery = {
    _id: new ObjectId(taskId),
    projectId: new ObjectId(projectId),
  };
  if (currentUser.role === USER_ROLES.WORKER) {
    findQuery["workers._id"] = new ObjectId(currentUser._id);
  } else if (currentUser.role === USER_ROLES.GENERAL_CONTRACTOR) {
    findQuery["generalContractor._id"] = new ObjectId(currentUser._id);
  }
  const taskCollection = await tasks();
  const task = await taskCollection.findOne(findQuery);

  if (!task) {
    throw new Error("Task not found");
  }
  task.canEdit =
    task.status !== TASK_STATUSES.COMPLETED &&
    [
      USER_ROLES.GENERAL_CONTRACTOR,
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
    ].includes(currentUser.role);
  return task;
};

const updateTask = async (
  currentUser,
  projectId,
  taskId,
  title,
  description,
  workerIds
) => {
  if (!currentUser) {
    throw new Error("You must be logged in to update task");
  }

  taskId = helpers.checkId(taskId, "Task Id");
  title = helpers.checkString(title, "title");
  description = helpers.checkString(title, "description");
  workerIds = helpers.checkIdArray(workerIds, "Worker Ids");

  const userCollection = await users();
  const workers = await userCollection
    .find({
      _id: { $in: workerIds.map((id) => new ObjectId(id)) },
    })
    .toArray();
  if (!workers || workers.length !== workerIds.length) {
    throw new Error("One or more worker ids are wrong");
  }

  const findQuery = {
    _id: new ObjectId(taskId),
    projectId: new ObjectId(projectId),
  };
  if (currentUser.role === USER_ROLES.GENERAL_CONTRACTOR) {
    findQuery["generalContractor._id"] = new ObjectId(currentUser._id);
  }

  const taskCollection = await tasks();
  const updatedTask = {
    title,
    description,
    workers: workers.map(({ _id, email }) => ({ _id, email })),
  };
  const updatedInfo = await taskCollection.findOneAndUpdate(
    findQuery,
    { $set: updatedTask },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n !== 1 || !updatedInfo.value) {
    throw new Error("Could not update task");
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  updatedInfo.value.canEdit =
    updatedInfo.value.status !== TASK_STATUSES.COMPLETED &&
    [
      USER_ROLES.GENERAL_CONTRACTOR,
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
    ].includes(currentUser.role);
  return updatedInfo.value;
};

const updateTaskStatus = async (currentUser, projectId, taskId, status) => {
  if (!currentUser) {
    throw new Error("You must be logged in to change task status");
  }
  taskId = helpers.checkId(taskId, "Task Id");
  status = helpers.checkString(status);

  if (!Object.values(TASK_STATUSES).includes(status)) {
    throw new Error("Task status is not correct");
  }

  const task = await getTaskById(currentUser, projectId, taskId);

  if (task.status === TASK_STATUSES.COMPLETED) {
    throw new Error("Task already completed");
  }

  const taskCollection = await tasks();
  const updatedInfo = await taskCollection.findOneAndUpdate(
    { _id: new ObjectId(taskId) },
    {
      $set: {
        status,
        ...(status === TASK_STATUSES.COMPLETED
          ? { completedOn: new Date() }
          : {}),
      },
    },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n !== 1 || !updatedInfo.value) {
    throw new Error("Could not update task");
  }
  updatedInfo.value._id = updatedInfo.value._id.toString();
  updatedInfo.value.canEdit =
    updatedInfo.value.status !== TASK_STATUSES.COMPLETED &&
    [
      USER_ROLES.GENERAL_CONTRACTOR,
      USER_ROLES.ADMIN,
      USER_ROLES.SALES_REP,
    ].includes(currentUser.role);
  return updatedInfo.value;
};

const deleteTask = async (currentUser, projectId, taskId) => {
  if (!currentUser) {
    throw new Error("You must be logged in to change task status");
  }
  taskId = helpers.checkId(taskId, "Task Id");

  const task = await getTaskById(currentUser, projectId, taskId);

  if (task.status === TASK_STATUSES.COMPLETED) {
    throw new Error("Cannot delete a completed task");
  }

  const taskCollection = await tasks();
  const updatedInfo = await taskCollection.findOneAndDelete({
    _id: new ObjectId(taskId),
  });
  if (updatedInfo.lastErrorObject.n !== 1 || !updatedInfo.value) {
    throw new Error("Could not delete task");
  }
  return true;
};

export {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
