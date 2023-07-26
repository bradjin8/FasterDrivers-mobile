def sort_by_type(results):
    res = {}
    for item in results:
        res.setdefault(item['type'], []).append(item)
    return res

def sort_by_category(results):
    menu_data = results.get('dishes', None)  # use get instead of pop
    sorted_dishes = {}
    if menu_data:
        for item in menu_data:
            sorted_dishes.setdefault(item['category'], []).append(item)
    if 'dishes' in results:  # remove the old unsorted dishes
        del results['dishes']
    results['dishes'] = sorted_dishes  # assign the sorted dishes back to results
    return results
