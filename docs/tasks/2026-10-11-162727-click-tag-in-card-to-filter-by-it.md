---
id: "2026-10-11-162727-click-tag-in-card-to-filter-by-it"
status: "todo"
priority: "low"
assignee: null
epic: null
dueDate: null
created: "2026-10-11T15:27:27.281Z"
modified: "2026-10-11T15:32:48.712Z"
completedAt: null
labels: ["feature", "filtering"]
order: "a0"
---
# Click tag in card to filter by it

This is not trivial. Currently, filters are OR'ed. Clicking a tag to filter by it means keeping the currently OR'ed tags and forcing an AND between them and the clicked filter.

The simpler option would be to completely replace the current filter with the clicked tag, but that means also showing cards that are currently hidden.

## Proposal for a solution

When clicking the tag, we actually don't change the filter at all; we apply a second filter layer that does the AND operation with the current filter.

The hard part is communicating this second filter layer in a way that is easy to understand. My first thought was to collapse cards that don't have the tag together into a single ghost card with a closed eye icon, and clicking the ghost card would clear the filter and bring them back. Maybe we could try that.