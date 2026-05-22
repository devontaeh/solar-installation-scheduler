# Notes

## Edge Cases Not Handled
- Duplicate employee or building IDs — silent scheduling errors at runtime
- Invalid building type from deserialized input — crashes with unhelpful error
- Zero-crew requirement — building would be marked scheduled with empty crew

## Improvements
- Real date-based unavailability rather than day-of-week strings
- Buildings requiring multiple days of work
- Employee overtime / max hours per week cap
- Crew preferences or skill matching beyond role type

## Tests Not Added
- Building permanently unschedulable due to insufficient certified employees — 30min
- Stress test with 100+ employees and 50+ buildings to validate scheduler performance — 1hr
- Invalid input guards on Employee and Building constructors — 30min
