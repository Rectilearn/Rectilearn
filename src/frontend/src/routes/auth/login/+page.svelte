<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchApi, fetchUserData, formatApiErrors } from '$lib/api';
	import { Form } from '$lib/components/forms';

	let email = '';
	let password = '';

	let errorMessages: string[] = [];

	async function handleLogin() {
		const response = await fetchApi('auth/token/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				username: email,
				password
			})
		});

		if (response.ok) {
			fetchUserData().then(() => goto('/dashboard'));
		} else {
			console.log()
			errorMessages = [(await response.json())["detail"]];
		}
	}
</script>

<!-- bg -->
<div class="dark:bg-gray-900 h-full flex flex-col items-center justify-center flex-auto">
	<!-- container -->
	<div class="max-w-lg py-12 md:py-24 px-0 sm:px-8 w-full">
		<!-- vstack -->
		<div class="flex flex-col space-y-8">
			<!-- vstack -->
			<div class="flex flex-col space-y-6">
				<!-- vstack -->
				<div class="flex flex-col space-y-2 md:space-y-3 text-center">
					<h1 class="text-4xl font-bold">Log in to your account</h1>
					<!-- hstack -->
					<div class="flex flex-row space-x-1 justify-center font-light">
						<p class="dark:text-gray-300">Don't have an account?</p>
						<a href="/auth/signup" class="text-[#90cdf4] hover:underline">Sign up</a>
					</div>
				</div>
			</div>
			<!-- Form -->
			<div
				class="py-6 sm:py-8 px-4 sm:px-10 bg-white dark:bg-[#2D3748] shadow-none sm:shadow-md rounded-xl"
			>
				<Form bind:errorMessages on:submit={handleLogin}>
					<div class="flex flex-col space-y-6">
						<div class="flex flex-col space-y-5">
							<div class="flex flex-col space-y-2">
								<label for="email">Email</label>
								<input
									id="email"
									type="email"
									bind:value={email}
									name="username"
									class="dark:bg-black/[.16] border border-solid border-gray-300 dark:border-white/[.16] focus:outline-none hover:border-gray-500 hover:dark:border-white/[.24] focus:border-[#63b3ed] focus:shadow-[0_0_0_1px_#63b3ed] transition-[border-color] duration-200 px-3 py-2 rounded-md"
								/>
							</div>
							<div class="flex flex-col space-y-2">
								<label for="password">Password</label>
								<input
									id="password"
									type="password"
									bind:value={password}
									name="password"
									class="dark:bg-black/[.16] border border-solid border-gray-300 dark:border-white/[.16] focus:outline-none hover:border-gray-500 hover:dark:border-white/[.24] focus:border-[#63b3ed] focus:shadow-[0_0_0_1px_#63b3ed] transition-[border-color] duration-200 px-3 py-2 rounded-md"
								/>
							</div>
						</div>
						<div class="flex flex-row justify-between">
							<a href="#forgot" class="text-[#90cdf4] hover:underline">Forgot password?</a>
						</div>
						<div class="flex flex-col space-y-6">
							<button
								type="submit"
								class="bg-[#4299e1] py-2 rounded-md text-white hover:scale-[1.01] duration-200"
								>Login</button
							>
							<div class="flex flex-row items-center">
								<!-- divider with or in between -->
								<hr class="opacity-60 border-0 border-b border-solid border-gray-600 w-full m-0" />
								<p class="text-sm whitespace-nowrap text-gray-200 px-1">or</p>
								<hr class="opacity-60 border-0 border-b border-solid border-gray-600 w-full m-0" />
							</div>
							<a href="#guest" class="max-w-[40%] self-center hover:no-underline">
								<!-- FiUser -->
								<p class="font-light">
									Login as <span
										class="text-blue-700 dark:text-[#90cdf4] hover:underline hover:scale-[1.05]"
										>Guest</span
									>
								</p>
							</a>
						</div>
					</div>
				</Form>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	body {
		@apply bg-[rgb(247,_250,_252)];
		background-image: none;
	}
</style>
