//
//  StampsSceneController.m
//  Registration
//  This is a truncated version of a procedural image placement scene. 
//  The code that I have chosen to omit is typical scene setup including background setting and scene
//  setting parsing. An NSMutableDictionary is created from an RPC callback performed on a previous scene.
//  
//  Other items of importance.
//  - Image files are being provided through the main applications bundle.
//  - _allowOverflow is set to allow images to overflow the right and bottom sides of the container.
//  
//  

- (void)createStamps
{
    for (NSString *key in self.stampsDict) {
        if ([[self.stampsDict valueForKey:key] boolValue]) {
            UIImageView *stampImg = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 119, 119)];
            NSString *imgFilepath = [[NSBundle mainBundle] pathForResource:key ofType:@"png"];
            UIImage *img = [[UIImage alloc] initWithContentsOfFile:imgFilepath];

            if (img != nil) {
                stampImg.image = img;
                stampImg.alpha = 0;
                [self.stamps addObject:stampImg];
            } else {
                NSLog(@"Stamp Name of %@ not found in the app.", key);
            }
        }
    }
}

- (void)centerViews:(NSArray *)stamps
{
    CGSize stampsContainerSize = self.stampsContainer.bounds.size;
    int stampPadding = 8;
    _displayView = TRUE;

    CGFloat width = 0;

    // Measure the total width taken by the buttons
    for (UIImageView *stamp in self.stamps) {
        width += stamp.bounds.size.width + stampPadding;
    }

    if (width > stampPadding) {
        width -= stampPadding;
    }

    // If the buttons width is shorter than the visible bounds, adjust origin
    CGFloat origin = 0;

    if (width < stampsContainerSize.width) {
        origin = (stampsContainerSize.width - width) / 2.f;
    }

    // Place buttons
    CGFloat x = origin;
    CGFloat y = 0;
    int viewCounter = 0;

    for (UIImageView *stamp in self.stamps) {
        int maxStampsPerRow = (int)self.stampsContainer.bounds.size.width / ((int)stamp.bounds.size.width + stampPadding);
        int totalRows = (int)[self.stamps count] / maxStampsPerRow;
        int partialRowCount = (int)[self.stamps count] % maxStampsPerRow;
        int currentRow = viewCounter / maxStampsPerRow;

        if (partialRowCount <= maxStampsPerRow) {
            totalRows += 1;
        }

        // Checking to see if our stamps will overflow the right-hand side of our stampsContainer
        if (x + stamp.frame.size.width > stampsContainerSize.width) {
            y = (currentRow * 120) + (stampPadding * currentRow);
            x = 0;
        }

        // Checking to see if our stamps will overflow the bottom of our stampsContainer.
        if (y + stamp.frame.size.height > stampsContainerSize.height) {
            if (_allowOverflow != TRUE) {
                _displayView = FALSE;
            }
        }

        // Adding our stamp to the stampsContainer and incrementing our counter.
        if (_displayView) {
            stamp.center = CGPointMake(x + stamp.bounds.size.width / 2.f, y + stamp.bounds.size.height / 2.f);
            x += stamp.bounds.size.width + stampPadding;
            [self.stampsContainer addSubview:stamp];
            viewCounter++;
        }
    }
}

- (BOOL)storyboard:(FSStoryboard *)storyboard willTransitionOutToScene:(NSString *)sceneName
{
    [self.stampsContainer removeFromSuperview];

    return YES;
}

- (void)storyboard:(FSStoryboard *)storyboard didTransitionInFromScene:(NSString *)sceneName
{
    // This is a session record that contains the collected user's data up to this point
    NSMutableDictionary *pad = self.session.pad;
    NSLog(@"%s|pad=%@", __PRETTY_FUNCTION__, pad);

    // Clearing the stamps imgView array
    self.stamps = [[NSMutableArray alloc] init];

    // Re-Initing the user's stampsDict which contains their collected stamps.
    self.stampsDict = [pad valueForKey:@"stamps"];

    // Creating the stamps container and adding it to our main view.
    self.stampsContainer = [[UIView alloc] initWithFrame:CGRectMake(140, 250, 600, 450)];
    self.stampsContainer.backgroundColor = [UIColor clearColor];
    [self.view addSubview:self.stampsContainer];

    // Populating our stamps array
    [self createStamps];

    // Adding our stamps to the stampsContainer and aligning them properly.
    [self centerViews:self.stamps];

    // Fade all stamps to an alpha of 1
    [UIView beginAnimations:nil context:NULL];
    [UIView setAnimationDuration:0.6];

    for (UIImageView *stamp in self.stamps) {
        stamp.alpha = 1;
    }

    [UIView commitAnimations];
}

@end
