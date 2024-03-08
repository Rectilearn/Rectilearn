<script lang="ts">
    import type { IStudySet } from "$lib/types"
	import { createEventDispatcher } from "svelte";
    export let studySet: IStudySet;

    const dispatch = createEventDispatcher<{
        delete: BigInt
    }>();

    async function deleteStudySet(id: BigInt) {
		const response = await fetch(`/api/studysets/${id}/delete_study_set/`, {
			method: "DELETE",
			headers: {'Content-Type': 'application/json'}
		});
		
		if (response.status === 200) {
			dispatch("delete", id);
		} else {
			// toast({
			// 	title: "Error while deleting studyset",
            //     status: "error",
			// 	description: (await response.json()).detail[0].msg
			// })
		}
    }
</script>

<div class="flex justify-center items-center">
    <div class="max-w-[320px] w-full bg-white dark:bg-gray-700 shadow-2xl rounded-xl p-4 text-center">
        <div class="relative">
            <div class="aspect-[10/9]">
                <!-- how did we define isLoading -->
                <img src="https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
                    alt={studySet.subject} class="rounded-md md:rounded-xl">
            </div>
        </div>
        <div class="flex flex-col mt-2 mb-3">
            <div class="gap-1 mb-2">
                <!-- Tooltip?? -->
                <p class="font-medium text-gray-700 dark:text-white text-2xl overflow-hidden whitespace-nowrap text-ellipsis w-full">
                    {studySet.subject}
                </p>
            </div>
            <div class="flex items-center mb-2 justify-center">
                <button class="w-full text-sm p-2 bg-blue-500 flex justify-center items-center rounded-md" on:click={_ => alert("Play")}>
                    <svg class="h-4 fill-white dark:fill-black" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 512.055 512.055" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M500.235,236.946L30.901,2.28C16.717-4.813,0.028,5.502,0.028,21.361v469.333c0,15.859,16.689,26.173,30.874,19.081
                                    l469.333-234.667C515.958,267.247,515.958,244.808,500.235,236.946z M42.694,456.176V55.879l400.297,200.149L42.694,456.176z"/>
                            </g>
                        </g>
                    </svg>            
                    <p class="ml-2 text-white dark:text-black">Play</p>
                </button>
            </div>
            <div class="flex flex-row items-center gap-2">
                <button class="w-full text-sm p-2 bg-yellow-500 flex justify-center items-center rounded-md"
                    on:click={_ => alert("Edit")}>         
                    <p class="ml-2 text-white dark:text-black">Edit</p>
                </button>
                <button class="w-full text-sm p-2 bg-red-500 flex justify-center items-center rounded-md"
                    on:click={() => deleteStudySet(studySet.id)}>         
                    <p class="ml-2 text-white dark:text-black">Delete</p>
                </button>
            </div>
        </div>
        <p>{studySet.id}</p>
        <!-- {studySet.subject}
        {JSON.stringify(studySet.questions)} -->
    </div>
</div>

<!-- 

    const deleteStudySet = async () => {
		const response = await fetch(`/api/studysets/${id}/delete_study_set/`, {
			method: "DELETE",
			headers: {'Content-Type': 'application/json'}
		});
		
		if (response.status === 200) {
			props.deleteStudySet(id);
		} else {
			toast({
				title: "Error while deleting studyset",
                status: "error",
				description: (await response.json()).detail[0].msg
			})
		}
	};

	function onDComplete() {
		if (selected === "") {
			toast({
				title: "Please select a game",
				variant: "warning"
			})
			return;
		}
		setGameSession({
            game: selected,
            studySet,
			avatar: user.profile_picture_index,
        });
        Router.push("/games");
	}

    const EditStudySetModal = (props: any) => {
	const { currentStudySet, updateStudySet } = props;
	const {
		id,
		subject: currentSubject,
		questions: currentQuestions,
	} = currentStudySet;

	const { isOpen, onClose: oC } = props;
	const [v, setV] = useState<string>(currentSubject);
	const [questions, setQuestions] =
		useState<Array<StudySetQuestion>>(currentQuestions);
	const [editPressed, setEditPressed] = useState<boolean>(false);

	const toast = useToast();

	function onClose() {
		setEditPressed(false)
		setQuestions(currentQuestions);
		setV(currentSubject);
		oC();
	}

	const handleSubmission = async () => {
		if (questions.length < 1) {
			toast({
				title: "Please fill in something.",
				variant: "warning"
			});
			return;
		}
		const values = {
			subject: v,
			questions: questions,
		};

		const res = await fetch(`/api/studysets/${id}/update/`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(values),
		});

		if (!res.ok) {
			toast({
				title: "Something went wrong",
				description: res
					? (await res.json()).detail || "err"
					: "Something went wrong while creating studyset. Please try again.",
				status: "error",
				isClosable: true,
				duration: 4000,
			});
			return;
		}

		updateStudySet(await res.json());

		onClose();
	};
 -->
