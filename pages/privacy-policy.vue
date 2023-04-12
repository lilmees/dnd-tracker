<template>
  <NuxtLayout>
    <div class="space-y-4 my-20">
      <h1>
        Privacy Policy for DND-TRACKER
      </h1>
      <p>
        At DND-TRACKER, accessible from https://dnd-tracker.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by DND-TRACKER and how we use it.
      </p>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
      </p>
      <h2>
        Log Files
      </h2>
      <p>
        DND-TRACKER follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users movement on the website, and gathering demographic information.
      </p>
      <h2>Cookies</h2>
      <p>
        Like any other website, DND-TRACKER uses "cookies". These cookies are used to store information including visitors preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users experience by customizing our web page content based on visitors browser type and/or other information.
        <NuxtLink :to="localePath('/cookie-policy')" class="inline text-primary underline">
          Cookie policy
        </NuxtLink>
      </p>
      <h2>
        Privacy Policies
      </h2>
      <p>
        You may consult this list to find the Privacy Policy for each of the advertising partners of DND-TRACKER.
      </p>
      <ul>
        <li>
          <NuxtLink
            to="https://stripe.com/en-be/privacy"
            target="_blank"
            rel
            class="inline text-primary underline"
          >
            Stripe
          </NuxtLink>
        </li>
      </ul>
      <p>
        Note that DND-TRACKER has no access to or control over these cookies that are used by third-party advertisers.
      </p>
      <h2>
        Third Party Privacy Policies
      </h2>
      <p>
        DND-TRACKERs Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
      </p>
      <p>
        You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers respective websites.
      </p>
      <h2>
        Childrens Information
      </h2>
      <p>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
      </p>
      <p>
        DND-TRACKER does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
      </p>
      <h2>
        Online Privacy Policy Only
      </h2>
      <p>
        This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in DND-TRACKER. This policy is not applicable to any information collected offline or via channels other than this website.
      </p>
      <h2>
        Consent
      </h2>
      <p>
        By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
const localePath = useLocalePath()
</script>

<style scoped>
p {
  @apply max-w-prose;
}

h2 {
  @apply pt-8;
}
</style>
