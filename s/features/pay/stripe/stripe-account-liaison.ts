
import {Stripe} from "stripe"

export function stripeAccountLiaison({stripe, reauthLink, returnLink}: {
		stripe: Stripe
		reauthLink: string
		returnLink: string
	}) {

	function prepareCreateAccountLink(
			type: "account_onboarding" | "account_update"
		) {
		return async function createAccountLink({stripeAccountId}: {
				stripeAccountId: string
			}) {
			const {url} = await stripe.accountLinks.create({
				type,
				account: stripeAccountId,
				refresh_url: reauthLink,
				return_url: returnLink,
			})
			return {stripeAccountLink: url}
		}
	}

	return {
		async createStripeAccount(): Promise<{stripeAccountId: string}> {
			const {id} = await stripe.accounts.create({type: "standard"})
			return {stripeAccountId: id}
		},
		createAccountOnboardingLink: prepareCreateAccountLink("account_onboarding"),
		createAccountUpdateLink: prepareCreateAccountLink("account_update"),
	}
}