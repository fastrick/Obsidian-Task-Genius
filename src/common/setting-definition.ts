import { WorkflowDefinition } from "../editor-ext/workflow";
import { TaskFilterOptions } from "../editor-ext/filterTasks";
import { t } from "../translations/helper";

export interface TaskProgressBarSettings {
	showProgressBar: boolean;
	addTaskProgressBarToHeading: boolean;
	addProgressBarToNonTaskBullet: boolean;
	enableHeadingProgressBar: boolean;
	addNumberToProgressBar: boolean;
	showPercentage: boolean;

	progressRanges: Array<{
		min: number;
		max: number;
		text: string;
	}>;

	autoCompleteParent: boolean;
	supportHoverToShowProgressInfo: boolean;
	markParentInProgressWhenPartiallyComplete: boolean;
	countSubLevel: boolean;
	hideProgressBarBasedOnConditions: boolean;
	hideProgressBarTags: string;
	hideProgressBarFolders: string;
	hideProgressBarMetadata: string;

	// Task state settings
	taskStatuses: {
		completed: string;
		inProgress: string;
		abandoned: string;
		notStarted: string;
		planned: string;
	};

	countOtherStatusesAs: string;

	// Control which tasks to count
	excludeTaskMarks: string;
	useOnlyCountMarks: boolean;
	onlyCountTaskMarks: string;

	// Progress range text customization
	customizeProgressRanges: boolean;

	// Task status switcher settings
	enableTaskStatusSwitcher: boolean;
	enableCustomTaskMarks: boolean;
	taskStatusCycle: string[];
	taskStatusMarks: Record<string, string>;
	excludeMarksFromCycle: string[];

	// Priority picker settings
	enablePriorityPicker: boolean;
	enablePriorityKeyboardShortcuts: boolean;

	// Date picker settings
	enableDatePicker: boolean;
	dateMark: string;
	// Cycle complete status settings
	enableCycleCompleteStatus: boolean;
	alwaysCycleNewTasks: boolean;

	// Workflow settings
	workflow: {
		enableWorkflow: boolean;
		autoAddTimestamp: boolean;
		autoAddNextTask: boolean;
		definitions: WorkflowDefinition[];
		autoRemoveLastStageMarker: boolean;
		calculateSpentTime: boolean;
		spentTimeFormat: string;
		timestampFormat: string;
		removeTimestampOnTransition: boolean;
		calculateFullSpentTime: boolean;
	};

	// Completed task mover settings
	completedTaskMover: {
		enableCompletedTaskMover: boolean;
		taskMarkerType: "version" | "date" | "custom";
		versionMarker: string;
		dateMarker: string;
		customMarker: string;
		completeAllMovedTasks: boolean;
		treatAbandonedAsCompleted: boolean;
		withCurrentFileLink: boolean;
	};

	// Quick capture settings
	quickCapture: {
		enableQuickCapture: boolean;
		targetFile: string;
		placeholder: string;
		appendToFile: "append" | "prepend" | "replace";
	};

	// Task filter settings
	taskFilter: {
		enableTaskFilter: boolean;
		keyboardShortcut: string;
		presetTaskFilters: Array<{
			id: string;
			name: string;
			options: TaskFilterOptions;
		}>;
	};
}

export const DEFAULT_SETTINGS: TaskProgressBarSettings = {
	showProgressBar: false,
	addTaskProgressBarToHeading: false,
	addProgressBarToNonTaskBullet: false,
	enableHeadingProgressBar: false,
	addNumberToProgressBar: false,
	autoCompleteParent: false,
	supportHoverToShowProgressInfo: false,
	markParentInProgressWhenPartiallyComplete: false,
	showPercentage: false,
	countSubLevel: true,
	hideProgressBarBasedOnConditions: false,
	hideProgressBarTags: "no-progress-bar",
	hideProgressBarFolders: "",
	hideProgressBarMetadata: "hide-progress-bar",

	// Default task statuses
	taskStatuses: {
		completed: "x|X",
		inProgress: ">|/",
		abandoned: "-",
		notStarted: " ",
		planned: "?",
	},

	countOtherStatusesAs: "notStarted",

	// Control which tasks to count
	excludeTaskMarks: "",
	onlyCountTaskMarks: "x|X",
	useOnlyCountMarks: false,

	// Progress range text customization
	customizeProgressRanges: false,
	progressRanges: [
		{ min: 0, max: 20, text: t("Just started {{PROGRESS}}%") },
		{ min: 20, max: 40, text: t("Making progress {{PROGRESS}}%") },
		{ min: 40, max: 60, text: t("Half way {{PROGRESS}}%") },
		{ min: 60, max: 80, text: t("Good progress {{PROGRESS}}%") },
		{ min: 80, max: 100, text: t("Almost there {{PROGRESS}}%") },
	],

	// Task status switcher settings
	enableTaskStatusSwitcher: false,
	enableCustomTaskMarks: false,
	taskStatusCycle: ["TODO", "DOING", "IN-PROGRESS", "DONE"],
	taskStatusMarks: {
		TODO: " ",
		DOING: "-",
		"IN-PROGRESS": ">",
		DONE: "x",
	},
	excludeMarksFromCycle: [],

	// Priority picker settings
	enablePriorityPicker: false,
	enablePriorityKeyboardShortcuts: false,

	// Date picker settings
	enableDatePicker: false,
	dateMark: "📅,📆,⏳,🛫",
	// Cycle complete status settings
	enableCycleCompleteStatus: true,
	alwaysCycleNewTasks: false,

	// Workflow settings
	workflow: {
		enableWorkflow: false,
		autoAddTimestamp: true,
		autoAddNextTask: false,
		autoRemoveLastStageMarker: false,
		calculateSpentTime: false,
		spentTimeFormat: "HH:mm:ss",
		removeTimestampOnTransition: false,
		timestampFormat: "YYYY-MM-DD HH:mm:ss",
		calculateFullSpentTime: false,
		definitions: [
			{
				id: "project_workflow",
				name: "Project Workflow",
				description: "Standard project management workflow",
				stages: [
					{
						id: "planning",
						name: "Planning",
						type: "linear",
						next: "in_progress",
					},
					{
						id: "in_progress",
						name: "In Progress",
						type: "cycle",
						subStages: [
							{
								id: "development",
								name: "Development",
								next: "testing",
							},
							{
								id: "testing",
								name: "Testing",
								next: "development",
							},
						],
						canProceedTo: ["review", "cancelled"],
					},
					{
						id: "review",
						name: "Review",
						type: "cycle",
						canProceedTo: ["in_progress", "completed"],
					},
					{
						id: "completed",
						name: "Completed",
						type: "terminal",
					},
					{
						id: "cancelled",
						name: "Cancelled",
						type: "terminal",
					},
				],
				metadata: {
					version: "1.0",
					created: "2024-03-20",
					lastModified: "2024-03-20",
				},
			},
		],
	},

	// Completed task mover settings
	completedTaskMover: {
		enableCompletedTaskMover: false,
		taskMarkerType: "version",
		versionMarker: "version 1.0",
		dateMarker: "archived on {{date}}",
		customMarker: "moved {{DATE:YYYY-MM-DD HH:mm}}",
		completeAllMovedTasks: false,
		treatAbandonedAsCompleted: false,
		withCurrentFileLink: false,
	},

	// Quick capture settings
	quickCapture: {
		enableQuickCapture: false,
		targetFile: "Quick Capture.md",
		placeholder: "Capture thoughts, tasks, or ideas...",
		appendToFile: "append",
	},

	// Task filter settings
	taskFilter: {
		enableTaskFilter: true,
		keyboardShortcut: "Alt-f",
		presetTaskFilters: [],
	},
};
