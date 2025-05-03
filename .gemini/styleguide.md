Descriptive Names

Rule: Use clear, unambiguous nouns for classes, interfaces, and data structures (e.g., CustomerRepository, OrderDetails).
Assumption: "Descriptive" is universally understood and agreed upon.
Counterpoint: Overly long names can decrease readability (DetailedSalesReportGeneratorForEuropeanMarkets). Brevity has value, especially in local scopes. Established conventions (like i, j for loop counters, e for exceptions) can be more readable than spelling everything out.
Test: Does the name accurately convey the entity's or variable's role without needing extra comments or deep code inspection?
Alternative: Naming conventions should be context-dependent and team-agreed. A shorter name within a method with limited scope might be perfectly clear.
Rule: Use active verb or verb phrases for methods that perform actions or computations (e.g., calculateTotal(), saveUser(user), validateInput()). Use nouns or adjectives for methods returning boolean states (e.g., isEmpty(), isValid).
Assumption: This verb/noun distinction clearly maps to all method types.
Counterpoint: Some methods might represent complex queries or state transitions where a simple verb doesn't capture the nuance. Getters/setters often use noun phrases prefixed with get/set (e.g., getUserName()), which is a standard convention, not strictly a verb phrase for an action.
Test: Can someone unfamiliar with the codebase predict what the method does based solely on its name and parameters?
Alternative: Focus on the intent. The name should reveal the purpose of the method within the class's responsibility.
Rule: Avoid abbreviations or acronyms unless they are universally understood within the project domain or programming language (e.g., Prefer databaseConnection over dbConn unless dbConn is a widely accepted team convention).
Assumption: There's a clear line between "universally understood" and ambiguous abbreviations.
Counterpoint: Domain-specific acronyms (e.g., CRM, SKU) are often more descriptive to domain experts than spelling them out. Strict avoidance can lead to awkwardly long names.
Test: Would a new developer joining the team understand the abbreviation without asking?
Alternative: Maintain a project glossary for domain-specific acronyms used in the codebase.

2. Clear Structure
Rule: Apply the Single Responsibility Principle (SRP): Each class or module should have one primary reason to change. Group data and the methods that operate on that data together.
Assumption: "One reason to change" is easy to define and apply consistently.
Counterpoint: Over-applying SRP can lead to fragmented code with too many small classes, increasing complexity in navigation and understanding interactions. Finding the right level of granularity is key.
Test: If you need to change a specific piece of business logic or data handling, are the changes confined to a single, well-defined class or module?
Alternative: Consider cohesion and coupling. Aim for high cohesion (related things together) within modules and low coupling (minimal dependencies) between modules. SRP is one way to achieve this.
Rule: Organize code files and directories logically based on features, layers (e.g., presentation, business logic, data access), or types. Be consistent.
Assumption: A single organizational scheme fits all projects.
Counterpoint: Feature-based vs. layer-based organization has different trade-offs. Feature-based might be better for team autonomy, while layer-based might enforce architectural separation more clearly.
Test: Can a developer quickly locate the code related to a specific feature or architectural concern?
Alternative: Choose the structure that best supports the team's workflow and the application's architecture, and document it.

3. Concise Methods
Rule: Methods should perform a single logical task. If a method name requires "and" (e.g., validateAndSaveData), consider splitting it.
Assumption: "Single logical task" is objectively definable.
Counterpoint: Sometimes, a sequence of closely related steps is clearer within one method than split across multiple private helpers, especially if those helpers aren't reusable. Over-splitting can obscure the workflow.
Test: Can you describe what the method does without using the word "and"? Can you easily write a unit test for its specific task?
Alternative: Focus on the level of abstraction. A method should operate at a consistent level. If it mixes high-level logic with low-level details, extract the low-level parts.
Rule: Aim for methods to be short (e.g., ideally under 20-30 lines), primarily by extracting logic into well-named private helper methods. Focus on conceptual clarity over strict line counts.
Assumption: Shorter is always better.
Counterpoint: An arbitrary line limit can lead to unnatural code fragmentation. A slightly longer method might be more readable if it represents a single, coherent algorithm. The cognitive load (how much you need to keep in your head) is more important than line count.
Test: Does the method fit comfortably on the screen? Can you understand its purpose quickly without excessive scrolling or mental juggling?
Alternative: Limit nesting depth (e.g., max 2-3 levels) and the number of distinct logical operations within a method.

4. Consistent Formatting
Rule: Adopt and enforce an automated code formatter (e.g., Prettier, Black, gofmt, IDE settings) based on a team-agreed style guide (e.g., PEP 8, Google Style Guides).
Assumption: Consistency is the primary goal of formatting.
Counterpoint: While consistency is crucial, the chosen style should also prioritize readability. An automated tool enforces consistency but doesn't guarantee the underlying style is optimal. Debates about brace style or spacing can be time-consuming if not settled decisively.
Test: Is formatting handled automatically on save or commit? Are formatting debates eliminated from code reviews?
Alternative: Focus code reviews on logic and design, trusting the formatter for syntax.
Rule: Be consistent in naming conventions (e.g., camelCase vs. snake_case), spacing, indentation (spaces vs. tabs - pick one!), bracing style, and use of blank lines to separate logical blocks.
Assumption: The specific convention matters less than the consistency itself.
Counterpoint: Language-specific idioms often favor certain conventions (e.g., snake_case in Python, camelCase in Java/JavaScript). Following idiomatic conventions improves readability for experienced developers in that language.
Test: Does the code look uniform regardless of who wrote it?
Alternative: Use linters alongside formatters to enforce naming conventions and other style aspects beyond just whitespace.

5. Comments
Rule: Write comments to explain the why (intent, rationale, business rules, compromises) not the what (the literal function of the code, if it's clear).
Assumption: Clear code doesn't need comments explaining what it does.
Counterpoint: Sometimes, complex algorithms or non-obvious language features do benefit from a brief "what" comment, even if names are good. The goal is clarity for the reader, who might lack full context.
Test: Does the comment provide information that isn't immediately obvious from reading the code itself?
Alternative: Prioritize self-documenting code (clear names, structure). Use comments as a last resort or for higher-level explanations.
Rule: Keep comments accurate and up-to-date. Delete commented-out code instead of leaving it; rely on version control history.
Assumption: Developers will diligently update comments.
Counterpoint: Comments inevitably drift from the code. This strengthens the argument for minimizing comments and maximizing code clarity. Commented-out code is technical debt.
Test: When you refactor code, do you also refactor or delete its associated comments?
Alternative: Use documentation generation tools (like Javadoc, Sphinx) for API comments, which are often easier to keep in sync.

6. Encapsulation
Rule: Default to making class members (variables, methods) private. Only expose (public, internal, protected) what is necessary for collaborators.
Assumption: Maximal restriction is the best starting point.
Counterpoint: Overly strict encapsulation can sometimes make testing harder or require awkward workarounds. In some languages/paradigms (e.g., Python's convention-based privacy), the focus is less on enforcement and more on signaling intent.
Test: Does the public interface of the class hide its internal implementation details effectively? Could the internal implementation change without affecting classes that use it?
Alternative: Think in terms of contracts. The public interface defines the contract the class offers. Keep this contract minimal and stable.
Rule: Prefer exposing behavior (methods) over exposing data directly (raw access to member variables, even via simple getters/setters). Methods should maintain the object's invariants.
Assumption: Objects should always control their state manipulation.
Counterpoint: Simple data-transfer objects (DTOs) or immutable data structures often just hold data, and direct access (or simple getters) is appropriate. Over-engineering behavior into simple data holders is unnecessary.
Test: Does the class maintain a valid state (its invariants) regardless of how its public methods are called? Are callers manipulating the object's state directly, or are they asking the object to perform actions?
Alternative: Consider immutability. Immutable objects have strong encapsulation benefits as their state cannot be changed after creation.

7. Error Handling
Rule: Use exceptions for exceptional/unrecoverable situations, not for expected control flow. Catch specific exception types, not generic ones, where possible.
Assumption: The distinction between "exceptional" and "expected" is always clear.
Counterpoint: In some cases (e.g., validating user input), using exceptions for validation errors can simplify the calling code compared to checking return codes or status objects, even if errors are "expected". This is debatable (checked vs. unchecked exceptions, language idioms).
Test: Does an exception indicate a genuine problem that prevents the current operation from succeeding normally?
Alternative: Consider using result objects or option types (common in functional programming) to handle expected "error" conditions or absence of values explicitly without exceptions.
Rule: Never ignore or silently swallow exceptions. Handle them appropriately (log, retry, wrap and re-throw, return an error state) or allow them to propagate to a designated handler. Ensure resource cleanup (e.g., files, connections) using finally blocks, try-with-resources, using, or similar constructs.
Assumption: All exceptions need active handling at some level.
Counterpoint: There might be rare cases where catching a very specific exception and doing nothing is intentional (though it should be commented why). The key is conscious handling, not silent failure.
Test: If an error occurs, is it logged with sufficient context? Are resources reliably released?
Alternative: Implement a global exception handling strategy for the application to catch unhandled exceptions, log them, and potentially provide a graceful failure response to the user.

8. Testability
Rule: Design classes to be easily testable in isolation. Use Dependency Injection (DI) to provide dependencies (collaborators) rather than having classes create them internally or rely on global state/singletons.
Assumption: Testability is a primary driver of design. DI is always the best way to provide dependencies.
Counterpoint: Designing purely for testability can sometimes lead to overly abstract or complex designs. Simple utility classes or functions might not need DI. Global immutable configuration might be acceptable.
Test: Can you instantiate the class and run its methods in a unit test without needing a database, network, or complex setup? Can you easily substitute mock/fake versions of its dependencies?
Alternative: Focus on reducing side effects. Pure functions are inherently testable. Minimize reliance on mutable shared state.
Rule: Avoid static methods and state where possible, as they are harder to mock/substitute in tests. Prefer instance methods.
Assumption: static is inherently bad for testing.
Counterpoint: Static utility functions with no side effects (like Math.max()) are perfectly fine and easy to test. The problem arises when static methods access static mutable state or have complex dependencies.
Test: Does the static method depend on or modify global/static state? Does it have hidden dependencies?
Alternative: If static methods are necessary, ensure they are pure functions or depend only on their inputs. If they need dependencies, consider passing them as arguments, even if static.
