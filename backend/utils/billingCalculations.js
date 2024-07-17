const billingCalculations = {
  calculateNextBillingDate: () => {
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return oneMonthFromNow;
  },
  shouldRenewSubscriptionPlan: (user) => {
    const today = new Date();
    return !user?.nextBillingDate || user?.nextBillingDate <= today;
  },
};

module.exports = billingCalculations;
