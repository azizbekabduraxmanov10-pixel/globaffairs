// Fallback data source for environments where fetch(file://) is not allowed.
// Use this file for direct file:// browsing without a development server.

const termsData = {
  international_relations: [
    {
      term: "Sovereignty",
      advanced: "The supreme authority and independence of a state to govern itself and make autonomous decisions within its territory without external interference.",
      simple: "The authority of a state to govern itself.",
      example: "Uzbekistan controls its own policies."
    },
    {
      term: "Diplomacy",
      advanced: "The practice and art of managing international relations through negotiation, dialogue, and formal interactions between states to achieve cooperative agreements.",
      simple: "The practice of managing international relations through negotiation.",
      example: "Countries send ambassadors to negotiate treaties."
    }
  ],
  international_law: [
    {
      term: "Treaty",
      advanced: "A legally binding formal agreement negotiated and ratified between sovereign states or international organizations that establishes mutual rights, obligations, and procedures for cooperation.",
      simple: "A formally concluded and ratified agreement between states.",
      example: "The Geneva Conventions regulate wartime conduct."
    }
  ]
};

// Export for Node.js/CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = termsData;
}
