# station-content-model Specification

## Purpose

Defines the station content model as the single source of truth for the site's
text, links, assets, ordering, and which three-dimensional desk object represents
each station, so that editing content in one place is sufficient to change the
site.

## Requirements

### Requirement: Station content is the single source of truth

The station content model SHALL define, for every station, its displayed content,
its position in the site's ordering, and which desk object represents it. No other
source SHALL independently decide which object a station is drawn as.

#### Scenario: Station declares its own desk object

- **WHEN** a station declares which desk object represents it
- **THEN** the scene draws that station using that object
- **AND** no separate mapping outside the content model is consulted to choose it

#### Scenario: Changing a station's declared object changes the scene

- **WHEN** a maintainer changes the desk object a station declares, and that object
  is one the scene can build
- **THEN** the station is drawn as the newly declared object
- **AND** no other file needs editing for the scene to reflect the change

### Requirement: Every station resolves to a buildable desk object

Startup SHALL fail loudly when a station declares a desk object the scene cannot
build. A station MUST NOT be silently omitted from the scene while still appearing
in the navigation and in the readable content.

#### Scenario: Station declares an unknown desk object

- **WHEN** a station declares a desk object for which no scene object exists
- **THEN** startup raises an error identifying the station and the unresolved object
- **AND** the site falls back to its fully readable document form rather than
  presenting a scene with a missing station

#### Scenario: Every station resolves

- **WHEN** every station declares a desk object the scene can build
- **THEN** the scene contains exactly one desk object per station
- **AND** startup completes without error

#### Scenario: Wiring is verified automatically

- **WHEN** the project's test suite runs
- **THEN** a test fails if any station declares an unbuildable desk object or has no
  position assigned along the bench

### Requirement: Station order determines camera and navigation order

The order of stations in the content model SHALL determine both the order the camera
travels along the bench and the order of the navigation controls.

#### Scenario: Reordering stations reorders the journey

- **WHEN** a maintainer reorders the stations in the content model
- **THEN** the camera visits them in the new order as the visitor scrolls
- **AND** the navigation controls appear in that same new order

### Requirement: A station renders only the content it declares

Each station SHALL render exactly the content sections it declares. Sections a
station omits MUST NOT produce empty or placeholder markup.

#### Scenario: Station omits optional sections

- **WHEN** a station declares no figures, no technical stack, and no external links
- **THEN** its rendered content contains no figure, stack, or link sections at all
- **AND** the sections it does declare render in full

#### Scenario: Every station renders non-empty content

- **WHEN** the project's test suite renders each station's content
- **THEN** every station produces non-empty markup containing its title

### Requirement: Rendered content is escaped

Text from the content model SHALL be escaped when rendered, so that characters with
meaning in markup cannot alter the page's structure.

#### Scenario: Content contains markup characters

- **WHEN** a station's text contains characters such as `<`, `>`, `&`, or `"`
- **THEN** those characters display as written
- **AND** they do not introduce or close any element or attribute
